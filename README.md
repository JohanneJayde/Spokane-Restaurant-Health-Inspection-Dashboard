# Gonzaga Hackathon 2023 Project - Spokane Food Establishment Dashboard
This is a copy of the GitHub repo that my team used for the Gonzaga Hackathon 2023

### Team Members: Johanne McClenahan, Alexa Darrington, Will Reese, and Tyler Woody

### Background
On November 4th, 2023, I and three other Eastern Washington University Students competed in the 2023 Gonzaga Hackathon. This event took place over twelve hours but was from 7:30 am to 1:00 am. We made a visualizer for the Spokane Regional Health District's Food Establishment Reports. The competition concluded by being judged by industry professionals from Two Barrels, Schweitzer Engineering Laboratories, and Limelyte Technology Group. Out of around 120 people who attended, **we won 1st place**.

### Project Idea:
Our idea spawned from an idea that an EWU graduate student had when browsing the Spokane Regional Health District. He found that the [Food Establishment](https://srhd.org/programs-and-services/food-establishment-inspections) reports for Spokane were not very easily accessible or readable. He talked about how someone could make the data more readable and searchable, which would help a lot of people. At this time, I was in talks to get a group of EWU students to attend the GU Hackathon for the first time. I ended up picking this project for my team because it resonated with me.

### Description
This web application allows people to search through all Spokane Restaurants and look through the list of inspections the SRHD has done on them in around the past two years. This allows users to make more informed choices on what restaurants they choose to eat at. It improves upon the PDF format the data was originally in as you can visually see each restaurant on the map and click on them. This was a SPA.

### Technology Used
#### HTML / CSS / JS:
We used a vanilla stack for the front end. Everyone on the team besides me did not have a ton of experience with creating websites. However, it worked out since our project was simple and there wasn't much to gain by using a Framework.
#### Python
Our backend was on Python via Flask. This was done since it was simple to create a server and run it. We were also using Python to parse the PDF (yes that sounds as bad as it is) into a JSON file to be used to pass to the client-side to display.
#### Google Maps API
We went with Google Maps to display the restaurants. This was because that's the one we all thought of and it is used a lot on other websites when they want to display locations.

### My Role
My role on the team was the front-end person. As a result, I did all of the front end for the site. This involved working with the Google Maps API to display the website and also adding the search functionality.

### Features
1. A user can click on a marker on the map, and it will display the restaurant's inspections that they have chosen. It also displays a list of health code violations that they received.
2. When viewing a restaurant's inspections, a user will be able to see the low-priority code violations as `blue` and high violations as `red`.
3. From the sidebar, a user can search all restaurants within the report in real-time to filter out the restaurants that they are not interested in.

### Running this project
1. Have Python installed on your computer.
2. Using your Python package manager of choice, ensure that `Flask` is installed on your computer.
3. Using the IDE of your choice or command line, run `main.py`; it should open a localhost on port 8000.
4. Enjoy!

<b>Note</b>: This is using my API Key so it could cause issues with running from your machine. Please supply your own if you have one. For now, I will keep mine in code but will eventually phase it out.

### Issues
#### Parsing the PDF
This took around four hours of the twelve to parse the PDF's data into a usable format within Python. This involved a lot due to how a PDF is formatted and all the extra text that was in the footer of each page. This caused issues that persisted to the end. However, most of the data was successfully converted.
#### Working with Google Maps API:
The Google Maps API was difficult at times to work with due to how it stored data. A random issue that we ran into was trying to correctly place the map using Flexbox or Grid however it did not work correctly due to rendering. There were also issues with searching data and allowing users to search continuously without having markers disappear forever.

### Conclusion
The GU Hackathon was the first Hackathon that I attended. It was very nerve-racking. It was also hard since I became the leader of the team and had to make sure that everyone felt good going into the day. It didn't help that during the competition, people kept coming up to us and talking about how good our project was. Due to the growing expectations of our project, I spent 6 hours straight working on the website. This was very hard, but I tried my hardest to meet the expectations of the judges. It was very awesome to know that we were able to win out of all the students in the Spokane area.

Here is a [link](https://www.gonzaga.edu/news-events/stories/2023/11/20/hackathon-2023) to learn more about the event.
