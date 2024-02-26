from flask import Flask, render_template

#from DataParser import DataParser

# Setting up the flask server application
app = Flask(__name__)


def main():
    app.run(host="localhost", port=8000, debug=True)
    app.config['SERVER_NAME'] = 'Spokane Regional Health District Food Inspection Tracker'

@app.route("/")
def test():
    return render_template('index.html')


if __name__ == "__main__":
    main()
