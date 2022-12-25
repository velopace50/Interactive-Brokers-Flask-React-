from flask import Flask, render_template, request
from flask_socketio import SocketIO
from random import random
from threading import Lock
from datetime import datetime

"""
Background Thread
"""
thread = None
thread_lock = Lock()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'donsky!'
socketio = SocketIO(app, cors_allowed_origins='*')

"""
Get current date time
"""


def get_current_datetime():
    now = datetime.now()
    return now.strftime("%m/%d/%Y %H:%M:%S")


"""
Generate random sequence of dummy sensor values and send it to our clients
"""


def background_thread():
    print("Generating random sensor values")
    while True:
        # # dummy_sensor_value = round(random() * 100, 3)
        # try:
        #     price_data = read_json('tsla_price.json')
        #     print(price_data, price_data['value'])
        # except:
        #     continue
        # socketio.emit('updatePriceData', {
        #               'value': price_data['value'], "date": price_data['date']})
        # socketio.emit('updateHistogramData', {
        #               'value': price_data['value'], "date": price_data['date']})

        # try:
        #     volume_data = read_json('tsla_volume.json')
        #     print(volume_data, price_data['value'])
        # except:
        #     continue
        # socketio.emit('updateVolumeData', {
        #               'value': volume_data['value'], "date": volume_data['date']})
        # socketio.sleep(1)
        dummy_sensor_value = round(random() * 100, 3)
        print(dummy_sensor_value, get_current_datetime())
        socketio.emit('updateSensorData', {
                      'value': dummy_sensor_value, "date": get_current_datetime()})
        socketio.sleep(1)


# def read_json(file_name):
#     # Opening JSON file
#     with open(f'json/{file_name}', 'r') as openfile:

#         # Reading from json file
#         json_object = json.load(openfile)
#         return json_object


"""
Serve root index file
"""


# @app.route('/')
# def index():
#     return render_template('index.html')


"""
Decorator for connect
"""


@socketio.on('connect')
def connect():
    global thread
    print('Client connected')

    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)


"""
Decorator for disconnect
"""


@socketio.on('disconnect')
def disconnect():
    print('Client disconnected',  request.sid)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)
