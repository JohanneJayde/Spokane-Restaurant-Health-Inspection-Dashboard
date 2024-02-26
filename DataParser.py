import json
from geopy.geocoders import Nominatim
from geopy.geocoders import GoogleV3

from PyPDF2 import PdfReader
import re

keywords = ["Violations", "Inspection Date", "Report Date", "Facility Address"]
counties = ["Spokane", "Spokane Valley", "Liberty Lake"]
class DataParser:
    doc = None

    def __init__(self, pdf_path):
        file = open(pdf_path, "rb")
        self.doc = PdfReader(pdf_path)

    # STATES
    # 0 = Start of file
    # 1 = Reading file entry
    def parse_file2(self):
        geolocator = Nominatim(user_agent=__name__)
        geolocator2 = GoogleV3(user_agent=__name__, api_key="AIzaSyDM2aIF6rrgDjkOZHmGyt41Bnhueg-Fspk")
        entries = {}
        state = 0
        current_entry = -1
        for page in self.doc.pages:
            page_text = page.extract_text()
            lines = page_text.split("\n")
            for line in lines:
                if current_entry > -1:
                    pattern = "Inspection Date: ([\d\s]*/[\d\s]*/[\d\s]*)"
                    inspection = re.search(pattern, line)
                    if inspection:
                        entries[current_entry]["Inspections"].append({
                            "Date:": inspection.group(1),
                            "Violations": [],
                            "Type": ""
                        })
                        continue
                    else:
                        violation_pattern = "Violations(.*)"
                        violation = re.search(violation_pattern, line)
                        if violation:
                            state = 1
                            entries[current_entry]["Inspections"][len(entries[current_entry]["Inspections"]) - 1]["Type"] = violation.group(1)
                            continue
                        elif state == 1:
                            pattern = "\d\d"
                            re2 = re.search(pattern, line[len(line) - 2:])
                            if re2:
                                code = line[len(line) - 2:]
                                violation = line[:len(line) - 2].strip()
                                entries[current_entry]["Inspections"][len(entries[current_entry]["Inspections"]) - 1]["Violations"].append({
                                    "Code": code,
                                    "Violation": violation
                                })
                                continue
                m = re.search("Facility Address", line)
                if m:
                    continue
                else: # Facility / address state
                    pattern = "(.*?) ([\d]+ [NESW ]+.+)"
                    #report_date = "Report Date:\.*"
                    match = re.match(pattern, line)
                    #match2 = re.match(report_date, line)
                    if match:
                        # print(line)
                        current_entry += 1
                        state = 0
                        entries[current_entry] = {
                            "Inspections": [],
                            "Address": "",
                            "Facility": "",
                            "Latitude": 0,
                            "Longitude": 0,
                        }
                        entries[current_entry]["Address"] = match.group(2).strip()
                        def find(locator, county):
                            try:
                                location = locator.geocode(entries[current_entry]["Address"] + " " + county)
                                if location:
                                   return location
                            except:
                                return None
                        result = None
                        for v in counties:
                            result = find(geolocator, v)
                            if result:
                                print("FOUND:", result)
                                break
                        if not result:
                            for v in counties:
                                result = find(geolocator2, v)
                                print("Location GOOGLE", v)
                                if result:
                                    print("FOUND:", result)
                                    break
                            if not result:
                                print("Could not find in time:", entries[current_entry]["Address"])
                        if result:
                            entries[current_entry]["Latitude"] = result.latitude
                            entries[current_entry]["Longitude"] = result.longitude
                            print(result.latitude, result.longitude)
                        entries[current_entry]["Facility"] = match.group(1).strip()
                        continue
                   # elif match2: #Report date throw away
                       # continue
        with open("data.txt", 'w') as fp:
            fp.write(json.dumps(entries, indent=3))