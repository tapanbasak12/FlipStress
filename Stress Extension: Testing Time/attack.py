from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
import json

def main():
    filename = input("Enter a filename for the output JSON file: ")
    if not filename:
        filename = "combinedData.json"  # Default filename if nothing is entered

    counter = 1  # Modify this number based on your experiment needs

    
    options = Options()
    options.add_argument("start-maximized")
    options.add_argument("user-data-dir=/home/tapan/.config/google-chrome/Profile 1")

    driver = webdriver.Chrome(options=options)

    driver.get("https://google.com")
    sleep(1)  # Originally 3 seconds, increased to 30 seconds as per your code

    target_results = []
    non_target_results = []
    labels = []

    # Adjust sleep times as needed for your application
    sleep_time_after_navigation = 1  # seconds
    sleep_time_after_click = 3  # seconds

    try:
        for i in range(counter):
            # Process the target
            driver.get("https://web.njit.edu/~tb358/attackpages/page1.html")

            sleep(sleep_time_after_navigation)
            btn_attack = driver.find_element(By.ID, "btnAttack")
            driver.execute_script("arguments[0].click();", btn_attack)
            sleep(sleep_time_after_click)
            txt_result = driver.find_element(By.ID, "results")
            target_results.append("\["+ txt_result.text + '],\n')


            # Process the non-target
            driver.get("https://web.njit.edu/~tb358/attackpages/page2.html")
            
            sleep(sleep_time_after_navigation)
            btn_attack2 = driver.find_element(By.ID, "btnAttack2")
            driver.execute_script("arguments[0].click();", btn_attack2)
            sleep(sleep_time_after_click)
            txt_result2 = driver.find_element(By.ID, "results")
            non_target_results.append('[' + txt_result2.text + '],\n')


        # Construct labels
        labels.extend([1] * counter)
        labels.extend([0] * counter)

        # Construct the final JSON output
        json_output = {
            "X": target_results + non_target_results,
            "y": labels
        }

        # Save to file
        with open(f"/home/tapan/Documents/Data/OneSecond/Extension Noise/New/{filename}.json", 'w') as f:
            json.dump(json_output, f, indent=4)

    except Exception as e:
        print(f"Interrupted by error: {e}")

    finally:
        driver.close()
        driver.quit()

if __name__ == "__main__":
    main()
