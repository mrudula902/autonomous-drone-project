class DJIStatus:

    def __init__(self):
        self.connected = False
        self.aircraft = "DJI Mini 4 Pro"
        self.controller = "DJI RC 2"
        self.mode = "STANDBY"
        self.mission_status = "IDLE"

    def connect(self):
        self.connected = True
        self.mode = "STANDBY"

    def disconnect(self):
        self.connected = False
        self.mode = "STANDBY"
        self.mission_status = "IDLE"

    def prepare_mission(self):
        self.mission_status = "READY"

    def start_mission(self):
        self.mission_status = "RUNNING"

    def stop_mission(self):
        self.mission_status = "STOPPED"

    def as_dict(self):
        return {
            "connected": self.connected,
            "aircraft": self.aircraft,
            "controller": self.controller,
            "mode": self.mode,
            "missionStatus": self.mission_status
        }