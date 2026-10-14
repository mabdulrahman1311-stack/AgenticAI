from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from ..database import get_db
from ..models import Topic, Paper, PaperAnalysis
from ..schemas import EnrichedPaperItem

router = APIRouter(prefix="/api", tags=["Papers & Intelligence Stream"])

@router.get("/topics/{topic_id}/papers", response_model=List[EnrichedPaperItem])
def get_topic_papers(
    topic_id: int,
    significance: Optional[str] = Query(None, description="Filter by High Impact, Contradiction Warning, Minor Update, Incremental Progress"),
    group_by_cluster: bool = Query(True, description="Collapse multi-source convergence clusters into single parent cards"),
    search: Optional[str] = Query(None, description="Search keyword in title or summary"),
    has_contradiction: Optional[bool] = Query(None, description="Filter contradiction warnings"),
    weakly_supported: Optional[bool] = Query(None, description="Filter caution-labeled papers"),
    db: Session = Depends(get_db)
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    query = (
        db.query(PaperAnalysis, Paper)
        .join(Paper, PaperAnalysis.paper_id == Paper.id)
        .filter(PaperAnalysis.topic_id == topic_id)
    )

    if significance:
        query = query.filter(PaperAnalysis.significance_level == significance)

    if has_contradiction is not None:
        query = query.filter(PaperAnalysis.has_contradiction == has_contradiction)

    if weakly_supported is not None:
        query = query.filter(PaperAnalysis.weakly_supported_warning == weakly_supported)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Paper.title.ilike(search_pattern),
                Paper.abstract.ilike(search_pattern),
                PaperAnalysis.summary.ilike(search_pattern)
            )
        )

    # Order by analyzed_at descending (latest first)
    records = query.order_by(desc(PaperAnalysis.analyzed_at)).all()

    # If grouping by cluster for Multi-Article Convergence:
    if group_by_cluster:
        clustered_results = []
        seen_clusters = {}  # cluster_id -> parent EnrichedPaperItem

        for a, p in records:
            item_dict = {
                "id": a.id,
                "paper_id": p.id,
                "topic_id": a.topic_id,
                "external_id": p.external_id,
                "title": p.title,
                "authors": p.authors if isinstance(p.authors, list) else [str(p.authors)],
                "abstract": p.abstract,
                "published_date": p.published_date,
                "source_url": p.source_url,
                "source_type": p.source_type,
                "cluster_id": p.cluster_id,
                "cluster_siblings_count": 0,
                "cluster_siblings": [],
                # Analysis fields
                "summary": a.summary,
                "research_question": a.research_question,
                "approach": a.approach,
                "key_findings": a.key_findings if isinstance(a.key_findings, list) else [],
                "relevance_score": a.relevance_score,
                "significance_level": a.significance_level,
                "confidence_score": a.confidence_score,
                "source_reliability_score": a.source_reliability_score,
                "delta_notes": a.delta_notes,
                "has_contradiction": a.has_contradiction,
                "contradiction_target_title": a.contradiction_target_title,
                "contradiction_detail": a.contradiction_detail,
                "value_metric_shifts": a.value_metric_shifts if isinstance(a.value_metric_shifts, list) else [],
                "weakly_supported_warning": a.weakly_supported_warning,
                "caution_notes": a.caution_notes,
                "evidence_snippets": a.evidence_snippets if isinstance(a.evidence_snippets, list) else [],
                "analyzed_at": a.analyzed_at
            }

            if p.cluster_id:
                if p.cluster_id in seen_clusters:
                    # Append as sibling to existing parent
                    parent = seen_clusters[p.cluster_id]
                    parent["cluster_siblings"].append({
                        "id": a.id,
                        "paper_id": p.id,
                        "title": p.title,
                        "source_type": p.source_type,
                        "source_url": p.source_url,
                        "authors": item_dict["authors"],
                        "summary": a.summary,
                        "reliability_score": a.source_reliability_score,
                        "published_date": p.published_date.isoformat()
                    })
                    parent["cluster_siblings_count"] = len(parent["cluster_siblings"])
                else:
                    # Mark as parent
                    seen_clusters[p.cluster_id] = item_dict
                    clustered_results.append(item_dict)
            else:
                clustered_results.append(item_dict)

        return clustered_results

    # Unclustered list
    flat_results = []
    for a, p in records:
        flat_results.append(
            EnrichedPaperItem(
                id=a.id,
                paper_id=p.id,
                topic_id=a.topic_id,
                external_id=p.external_id,
                title=p.title,
                authors=p.authors if isinstance(p.authors, list) else [str(p.authors)],
                abstract=p.abstract,
                published_date=p.published_date,
                source_url=p.source_url,
                source_type=p.source_type,
                cluster_id=p.cluster_id,
                cluster_siblings_count=0,
                cluster_siblings=[],
                summary=a.summary,
                research_question=a.research_question,
                approach=a.approach,
                key_findings=a.key_findings if isinstance(a.key_findings, list) else [],
                relevance_score=a.relevance_score,
                significance_level=a.significance_level,
                confidence_score=a.confidence_score,
                source_reliability_score=a.source_reliability_score,
                delta_notes=a.delta_notes,
                has_contradiction=a.has_contradiction,
                contradiction_target_title=a.contradiction_target_title,
                contradiction_detail=a.contradiction_detail,
                value_metric_shifts=a.value_metric_shifts if isinstance(a.value_metric_shifts, list) else [],
                weakly_supported_warning=a.weakly_supported_warning,
                caution_notes=a.caution_notes,
                evidence_snippets=a.evidence_snippets if isinstance(a.evidence_snippets, list) else [],
                analyzed_at=a.analyzed_at
            )
        )
    return flat_results
