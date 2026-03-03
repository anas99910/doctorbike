import urllib.request
import re
from bs4 import BeautifulSoup
import json

urls = [
    "https://bardahl.ma/collections/moto",
    "https://bardahl.ma/collections/moto?page=2"
]

products = []

for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    html = response.read()
    soup = BeautifulSoup(html, 'html.parser')
    
    # Based on Shopify default dawn theme structure
    product_cards = soup.select('.card-wrapper')
    
    for card in product_cards:
        try:
            title_el = card.select_one('.full-unstyled-link')
            if not title_el:
                continue
            title = title_el.text.strip()
            
            img_el = card.select_one('img')
            img_url = ""
            if img_el and img_el.has_attr('srcset'):
                # Extract the first image from srcset or src
                img_url = "https:" + img_el['src'].split('?')[0] + "?width=823"
            elif img_el and img_el.has_attr('src'):
                img_url = "https:" + img_el['src'].split('?')[0] + "?width=823"
                
            if title and img_url:
                products.append({
                    "title": title,
                    "image": img_url
                })
        except Exception as e:
            pass

print(json.dumps(products, indent=2))
