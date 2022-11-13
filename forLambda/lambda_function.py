import os
import json
import requests
import urllib
from time import sleep
from pprint import pprint
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
import io,sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import logging

#クエリで現在地と検索文字列を送信する。検索条件は2種類のフラグで決める
logger = logging.getLogger()

def lambda_handler(event, context):
    shop_list = tabelog_search_query("横浜", "焼肉", context)
    # shop_list = event
    shop_list = get_google_map_info(shop_list)
    shop_list = get_retty_info(shop_list)

    return {
        'statusCode': 200,
        "body": 
            json.dumps({
            "res":shop_list
        }, ensure_ascii=False)
        #'body': json.dumps('Hello from Lambda!')
    }


def tabelog_search_query(area_query, keyword_query, context):
    driver = setting_chromium()
    driver.get('https://tabelog.com/')
  
    driver.find_element_by_id("sa").send_keys(area_query)
    driver.find_element_by_id("sk").send_keys(keyword_query)
    driver.find_element_by_id("js-global-search-btn").click()
    
    #数ページクローリング
    shop_num = int(driver.find_elements_by_class_name("c-page-count__num")[2].text)
    page_num = int((shop_num + 19) / 20)
  
    shop_list = []
    pageurls = []
    
    pageurls.append(driver.current_url + "&SrtT=rvcn")
    driver.execute_script(f"window.scroll(0, document.body.screollHeight);")
    driver.find_element_by_class_name("c-pagination__arrow--next").click()
    pageurls.append(driver.current_url + "&SrtT=rvcn")
    driver.execute_script(f"window.scroll(0, document.body.screollHeight);")
    driver.find_element_by_class_name("c-pagination__arrow--next").click()
    pageurls.append(driver.current_url + "&SrtT=rvcn")

    # if page_num > 1:
    #     page_num = 1
    # for page in range(page_num):
    #     print(driver.current_url + "&SrtT=rvcn")
    #     pageurls.append(driver.current_url + "&SrtT=rvcn")
    #     if page_num >= 1:
    #         driver.execute_script(f"window.scroll(0, document.body.screollHeight);")
    #         driver.find_element_by_class_name("c-pagination__arrow--next").click()
    #         page_num -= 1
    driver.quit()
    
    for pageurl in pageurls:
        shop_list = shop_list_to_dict(shop_list, pageurl)
        shop_list = list(shop_list)
    return shop_list
    
def shop_list_to_dict(shop_list, pageurl):
    r = requests.get(pageurl, verify=False)
    soup = BeautifulSoup(r.content, 'html.parser')
    print(soup)
    
    shop_element_list = soup.find_all("div", class_= "list-rst")
    for soup in shop_element_list:
        shop_dict = {}
        try:
            rating = float(soup.find('span', class_= 'c-rating__val').text)
            if rating >= 3.1:
                shop_dict["shop_name"] = soup.find("a", class_= "list-rst__rst-name-target").text
                shop_dict["shop_url"] = soup.find("a",class_= "list-rst__rst-name-target").get("href")
                shop_dict["rating"] = rating
                shop_dict["dinner_price"] = soup.find("span",class_= "c-rating-v3__val").text
                shop_dict["lunch_price"] = soup.find("span",class_= "c-rating-v3__val").text
                shop_dict["main_image"] = soup.find("div",class_= "list-rst__photo-item--cover").get("data-original")
                # shop_dict["sub_image1"] = soup.find_element(By.CLASS_NAME, "list-rst__rst-name-target").get_attribute("src")
                # shop_dict["sub_image2"] = soup.find_element(By.CLASS_NAME, "list-rst__rst-name-target").get_attribute("src")
                shop_list.append(shop_dict)
        except NoSuchElementException:
            continue
        except AttributeError:
            continue
    return shop_list
    
def get_google_map_info(shop_list):
    for shop_dict in shop_list:
        shop_name = shop_dict["shop_name"]
        place_id = google_map_search_id(shop_name)
        rating = google_map_shop_details(place_id)
        if (rating != 0.0):
            shop_dict["google_map_rating"] = rating
    return shop_list
    
def google_map_shop_details(place_id):
    place_id = "placeid=" + place_id
    APIKey = os.environ['GOOGLEMAPAPI']
    baseurl="https://maps.googleapis.com/maps/api/place/details/json?"
    url = baseurl + place_id + "&key=" + APIKey
    req=urllib.request.Request(url)
   
    with urllib.request.urlopen(req) as res:
    # resは http.client.HTTPResponse
       body = json.loads(res.read()) # レスポンスボディ
       headers = res.getheaders() # ヘッダー(dict)
       status = res.getcode() # ステータスコード
       
    #   https://gaaaon.jp/blog/google_map_api
    # ["result"]["photos"]から画像が取れる
    try: 
        rating = body["result"]["rating"]
    except KeyError:
        rating = 0.0
    return rating
    
def google_map_search_id(search_query_keyword):
    APIKey = os.environ['GOOGLEMAPAPI']
    
    baseurl="https://maps.googleapis.com/maps/api/place/findplacefromtext/json?"
    input = "input=" + urllib.parse.quote(search_query_keyword)
    url = baseurl + input + "&inputtype=textquery&key=" + APIKey
    req=urllib.request.Request(url)
   
    with urllib.request.urlopen(req) as res:
        body = json.loads(res.read())
        headers = res.getheaders() # ヘッダー(dict)
        status = res.getcode() # ステータスコード
    return body["candidates"][0]["place_id"]
    
def get_retty_info(shop_list):
    baseurl = "https://retty.me/restaurant-search/search-result/?free_word_category="
    
    for shop_dict in shop_list:
        search_query_quote = urllib.parse.quote(shop_dict["shop_name"])
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"}
        r = requests.get(baseurl + search_query_quote)#, headers=headers)
        soup = BeautifulSoup(r.content, 'html.parser')
        header = soup.find("header", class_="search-result__header")
        
        #通常のレスポンスと違うソースが帰ってくるので探索
        shop_element = header.next_sibling.find_next_sibling("div").get(":restaurants")
        
        #お店がなかったとき
        if shop_element is not None:
            #ダブルクオーテーションで囲まないとエラーになる
            shop_element = json.loads(shop_element.replace("'", '"'))[0]
            if shop_element["familiarAttribute"] is not None:
                try:
                    genre = shop_element["familiarAttribute"]["category"]["name"]#.decode('unicode-escape')
                    popularity = shop_element["familiarAttribute"]["level"]
                    shop_dict["retty_familiar_genre"] = genre
                    shop_dict["retty_familiar_stars"] = popularity
                except KeyError:
                    shop_dict["retty_familiar_genre"] = ""
                    shop_dict["retty_familiar_stars"] = 0
            else:
                shop_dict["retty_familiar_genre"] = ""
                shop_dict["retty_familiar_stars"] = 0
            
    return shop_list
    
def setting_chromium():
    options = Options()
    options.add_argument("--headless")
    options.add_argument('--single-process')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("--no-sandbox")
    options.binary_location = "/opt/headless-chromium"
    
    
    browser = webdriver.Chrome(
            "/opt/chromedriver",
            chrome_options=options
            )
    browser.implicitly_wait(15)
    
    return browser
    
def decode_url(url):
    #url部分の取り出し
    target1 = "&fu"
    target2 = "&pu"
    
    idx = url.find(target1)
    url = url[idx+len(target1)+1:]
    
    idx = url.find(target2)
    url = url[:idx]
    
    #２回urlエンコードされているので２回デコード
    unquote = urllib.parse.unquote_to_bytes(url)
    unquote = unquote.decode()
    unquote = urllib.parse.unquote_to_bytes(unquote)
    return unquote.decode()
    