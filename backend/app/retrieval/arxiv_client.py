import datetime
import logging
import urllib.parse
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional
import httpx
from ..config import settings

logger = logging.getLogger("arxiv_client")

ATOM_NS = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}

class ArxivRetrievalError(Exception):
    pass

class ArxivClient:
    def __init__(self, base_url: Optional[str] = None, timeout: float = 12.0):
        self.base_url = base_url or settings.ARXIV_BASE_URL
        self.timeout = timeout

    async def fetch_papers(self, keywords: List[str], max_results: int = 15) -> Dict[str, Any]:
        """
        Fetches papers from arXiv API matching given keywords.
        Returns a dict with 'papers': List[Dict], 'status': 'success' | 'partial' | 'failed', 'error': Optional[str]
        """
        if not keywords:
            return {"papers": [], "status": "success", "error": None}

        # Build query: join keywords with OR / AND
        clean_terms = []
        for kw in keywords:
            kw_clean = kw.strip().replace('"', '')
            if kw_clean:
                if " " in kw_clean:
                    clean_terms.append(f'all:"{kw_clean}"')
                else:
                    clean_terms.append(f'all:{kw_clean}')

        query_str = " OR ".join(clean_terms)
        params = {
            "search_query": query_str,
            "start": 0,
            "max_results": max_results,
            "sortBy": "submittedDate",
            "sortOrder": "descending",
        }

        url = f"{self.base_url}?{urllib.parse.urlencode(params)}"
        logger.info(f"Querying arXiv API: {url}")

        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                response = await client.get(url)
                if response.status_code != 200:
                    logger.warning(f"arXiv API returned HTTP {response.status_code}")
                    return {
                        "papers": [],
                        "status": "partial",
                        "error": f"arXiv API returned status {response.status_code}"
                    }

                raw_xml = response.text
                papers = self._parse_atom_feed(raw_xml)
                return {
                    "papers": papers,
                    "status": "success",
                    "error": None
                }

        except httpx.TimeoutException as e:
            logger.warning(f"arXiv query timed out: {e}")
            return {
                "papers": [],
                "status": "partial",
                "error": "arXiv request timed out (partial source status recorded)"
            }
        except Exception as e:
            logger.error(f"Unexpected arXiv retrieval error: {e}", exc_info=True)
            return {
                "papers": [],
                "status": "failed",
                "error": str(e)
            }

    def _parse_atom_feed(self, xml_content: str) -> List[Dict[str, Any]]:
        papers = []
        try:
            root = ET.fromstring(xml_content)
            entries = root.findall("atom:entry", ATOM_NS)

            for entry in entries:
                id_elem = entry.find("atom:id", ATOM_NS)
                title_elem = entry.find("atom:title", ATOM_NS)
                summary_elem = entry.find("atom:summary", ATOM_NS)
                published_elem = entry.find("atom:published", ATOM_NS)
                updated_elem = entry.find("atom:updated", ATOM_NS)

                raw_id = id_elem.text.strip() if id_elem is not None and id_elem.text else ""
                # arXiv ID normalization: http://arxiv.org/abs/2403.12345v1 -> arxiv:2403.12345
                external_id = raw_id
                if "arxiv.org/abs/" in raw_id:
                    clean_id = raw_id.split("arxiv.org/abs/")[-1]
                    # strip version e.g. v1, v2
                    clean_id = clean_id.split("v")[0] if "v" in clean_id and clean_id[-1].isdigit() else clean_id
                    external_id = f"arxiv:{clean_id}"

                title = ""
                if title_elem is not None and title_elem.text:
                    title = " ".join(title_elem.text.split())

                summary = ""
                if summary_elem is not None and summary_elem.text:
                    summary = " ".join(summary_elem.text.split())

                # Authors
                authors = []
                for author_elem in entry.findall("atom:author", ATOM_NS):
                    name_elem = author_elem.find("atom:name", ATOM_NS)
                    if name_elem is not None and name_elem.text:
                        authors.append(name_elem.text.strip())

                # Published date
                pub_date = datetime.datetime.utcnow()
                if published_elem is not None and published_elem.text:
                    try:
                        pub_date = datetime.datetime.fromisoformat(published_elem.text.replace("Z", "+00:00"))
                    except Exception:
                        pass

                # Links
                abs_url = raw_id
                for link in entry.findall("atom:link", ATOM_NS):
                    if link.get("type") == "text/html" or link.get("rel") == "alternate":
                        abs_url = link.get("href", abs_url)

                if title and summary:
                    papers.append({
                        "external_id": external_id,
                        "title": title,
                        "authors": authors,
                        "abstract": summary,
                        "published_date": pub_date,
                        "source_url": abs_url,
                        "source_type": "primary_preprint",
                        "raw_source": "arXiv"
                    })

        except ET.ParseError as e:
            logger.error(f"Failed to parse XML from arXiv: {e}")
        return papers
