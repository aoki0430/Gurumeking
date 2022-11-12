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
    # shop_list, url = tabelog_search_query("横浜", "焼肉", context)
    shop_list = tabelog_search_query("横浜", "焼肉", context)
    print(shop_list)
    
    return {
        'statusCode': 200,
        "body": shop_list #shop_list
            # json.dumps({
            # "google_res": google_res,
            # "tabelog_res": json.dumps(tabelog_res),
            # "retty_res": retty_res,
        # }, ensure_ascii=False)
        #'body': json.dumps('Hello from Lambda!')
    }


def tabelog_search_query(area_query, keyword_query, context):
    driver = setting_chromium()
    # driver.set_window_size(1280,1696)
    driver.get('https://tabelog.com/')
  
    driver.find_element_by_id("sa").send_keys(area_query)
    driver.find_element_by_id("sk").send_keys(keyword_query)
    driver.find_element_by_id("js-global-search-btn").click()
    
# def extract():
#     url = driver.find_elements_by_xpath('//script[@async="true"]')[2].get_attribute("src")
#     driver.quit()
#     url = decode_url(url)
#     url += "&SrtT=rvcn" # 口コミ数順でソート
    
#     driver = setting_chromium
#     driver.set_window_size(1280,1696)
#     driver.get(url)()
#     return driver.page_source, url
    
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

def next_btn_click(driver):
    try:
        # 次へボタン
        elem_btn = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "c-pagination__arrow--next"))
        )
        actions = ActionChains(driver)
        actions.move_to_element(elem_btn)
        actions.click(elem_btn)
        actions.perform()
 
        # 間隔を設ける(秒単位）
        time.sleep(INTERVAL_TIME)
        return True
 
    except Exception as e:
        print("Exception\n" + traceback.format_exc())
        return False
    
def setting_chromium():
    options = Options()
    options.add_argument("--headless")
    options.add_argument('--single-process')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("--no-sandbox")
    # options.add_argument("--window-size=1280,1696")
    # options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36")
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
    