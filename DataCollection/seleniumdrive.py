from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
import os
import time as t
import pandas as pd

subjects = [
    "Accounting",
    "Apparel Merchandising Design",
    "Art",
    "Biology",
    "Business Administration",
    "Business Administration",
    "Chemistry",
    "Chinese",
    "Civil Engineering",
    "Communications",
    "Communications Specialist",
    "Communicative Sci Disorders",
    "Computer Sciences",
    "Construction Management",
    "Counseling",
    "Criminal Justice",
    "Curriculum and Inst Mth Edu",
    "Curriculum and Instruction",
    "Department Change",
    "Dept of Social Sciences",
    "Early Childhood Education",
    "Early Childhood Elementary Ed",
    "Economics",
    "Education",
    "Education Administration",
    "Educational Leadership",
    "Electrical Engineering",
    "Elementary Education",
    "Engineering General Courses",
    "English",
    "Entrepreneurship",
    "Experiential Learn Opportunity",
    "Family and Consumer Sciences",
    "Finance",
    "Food and Animal Science",
    "Foundation of Education",
    "French",
    "GEN",
    "Geography",
    "Graduate Studies",
    "Health Education",
    "Health Physical Education",
    "History",
    "Human Dev and Family Studies",
    "Liberal Studies",
    "Logistics Supply Chain Mgmt",
    "Management",
    "Management Info Systems",
    "Marketing",
    "Mathematics",
    "Mechanical Engineering",
    "Military Science",
    "Music",
    "Natural Res and Environ Sci",
    "Nutrition and Hospitality Mgmt",
    "Orientation",
    "Philosophy",
    "Physical Education",
    "Physics",
    "Political Science",
    "Psychology",
    "Public Administration",
    "Reading",
    "Science Education",
    "Secondary Education",
    "Social Work",
    "Sociology",
    "Spanish",
    "Special Education",
    "Sport Management",
    "Systems Engineering",
    "Urban Planning",
    "Urban and Regional Planning",
    "Visual Art",
]

#Helper functions
def parse_table(table, course):
    data= []
    isheader = True
    headers = [th.text for th in table.find_elements(By.TAG_NAME, 'th')]
    rows = table.find_elements(By.TAG_NAME, 'tr')
    for row in rows:
        cols = row.find_elements(By.TAG_NAME, 'td')
        if cols and len(cols) > 2:
            data.append([col.text for col in cols])
            if len(cols) != len(headers) and isheader:
                isheader = False
    if isheader:
        df = pd.DataFrame(data, columns=headers or None)
    else:
        df = pd.DataFrame(data)
    print(df)
    df.to_csv(f"DataCollection/{subjects[0]}{course}.csv", index=False)
    t.sleep(5)

def click_table(table):
    rows = table.find_elements(By.TAG_NAME, 'tr')
    for row in rows:
        cols = row.find_elements(By.TAG_NAME, 'td')
        if cols:
            if cols[2].tag_name.lower()== "form":
                try:
                    cols[2].submit()
                    t.sleep(1)
                    try:
                        table = driver.find_element(By.XPATH, '/html/body/div[3]/table')
                        parse_table(table, cols[0].text)
                    except:
                        print("Error getting the table")
                    t.sleep(2)
                    driver.back()
                    t.sleep(1)
                    
                except:
                    print("Error clicking the link")
                #Get the table again after clicking the link
            else:
                continue
            
#-------------------------------------------------------------------------------------------------------------
options = Options()
PROFILE_PATH = os.path.join(os.getcwd(), "DataCollection", "profile")
options.add_argument(f"user-data-dir={PROFILE_PATH}")
driver = webdriver.Chrome(options=options)
driver.get('https://sdo.aamu.edu/?saml=4934255a-6b58-4db4-8c3f-981f6f7dfad5')
t.sleep(20)
driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/span/map/table/tbody/tr[1]/td/table/tbody/tr/td[3]/a').click()
t.sleep(5)
driver.find_element(By.XPATH, '/html/body/div[3]/table[1]/tbody/tr[1]/td[2]/a').click()
t.sleep(1)
driver.find_element(By.XPATH, '/html/body/div[3]/table[1]/tbody/tr[3]/td[2]/a').click()
t.sleep(1)
dropdown = Select(driver.find_element(By.XPATH, '/html/body/div[3]/form/table/tbody/tr/td/select'))
dropdown.select_by_visible_text('Fall 2025')
t.sleep(2)
driver.find_element(By.XPATH, '/html/body/div[3]/form/input[2]').click()
t.sleep(2)
#------------------------------------------------------------------------------------------------------------
#Where the fun begins. Get the list of all the courses in the dropdown menu and select each one.
dropdown2 = Select(driver.find_element(By.XPATH, '/html/body/div[3]/form/table/tbody/tr/td/select'))
dropdown2.select_by_visible_text(subjects[0])
t.sleep(1)
driver.find_element(By.XPATH, '/html/body/div[3]/form/input[17]').click()
#Get Courses for a selected subject. 
table = driver.find_element(By.XPATH, '/html/body/div[3]/table[2]')
parse_table(table)



driver.quit()
print("Done")
