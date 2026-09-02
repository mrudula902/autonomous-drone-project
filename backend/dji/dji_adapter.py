from abc import ABC, abstractmethod


class DroneAdapter(ABC):

    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def get_status(self):
        pass

    @abstractmethod
    def upload_mission(self, mission):
        pass

    @abstractmethod
    def start_mission(self):
        pass

    @abstractmethod
    def stop_mission(self):
        pass