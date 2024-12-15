import time
import json
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By  # Import the By class

# Set the path to GeckoDriver executable and add username (must have geckodriver downloaded to run selenium+firefox)
geckodriver_path = "/home/<username>/Downloads/geckodriver/geckodriver-v0.35.0-linux64/geckodriver"

# Set Firefox profile path
profile_path = "/home/<username>/.cache/mozilla/firefox/<>"  # Replace with the actual path

# Create a Service object for GeckoDriver
service = Service(geckodriver_path)

# Set Firefox options with the profile
options = Options()
options.set_preference('profile', profile_path)

# Initialize Firefox WebDriver with the Service object and profile
driver = webdriver.Firefox(service=service, options=options)

driver.get("https://www.google.com")
#Start the extension manually during this sleep time and sign in to the target's profile manually if required
time.sleep(60)

# Set parameters
counter = 100  # Adjust based on your experiment needs
filename = "test.json"  # You can change or accept user input for filename
sleep_time_after_navigation = 1  # seconds
sleep_time_after_click = 12  # seconds

target_results = []
non_target_results = []
labels = []

try:
    for i in range(counter):
        
        # Process the target page
        driver.get("<URL_to_attacker_website_for_target>")
        time.sleep(sleep_time_after_navigation)
        btn_attack = driver.find_element(By.ID, "btnAttack")
        btn_attack.click()
        time.sleep(sleep_time_after_click)
        txt_result = driver.find_element(By.ID, "results").text
        
        target_results.append([float(x) for x in txt_result.split(',')])

        # Process the non-target page
        driver.get("<URL_to_attacker_website_for_non_target>")
        time.sleep(sleep_time_after_navigation)
        btn_attack2 = driver.find_element(By.ID, "btnAttack")
        btn_attack2.click()
        time.sleep(sleep_time_after_click)
        txt_result2 = driver.find_element(By.ID, "results").text

        non_target_results.append([float(x) for x in txt_result2.split(',')])

    for i in range(counter):   
        labels.append(1)  # Label for target
    for i in range(counter):
        labels.append(0)  # Label for non-target

    # Combine target and non-target results
    X = target_results + non_target_results

    json_output = {
        "X": X,
        "y": labels
    }

    # Save the final JSON output to a file
    with open(f"/<path>/{filename}", 'w') as json_file:
        json.dump(json_output, json_file, indent=4)

finally:
    driver.quit()
