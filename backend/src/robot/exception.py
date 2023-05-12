from src.exceptions import BadRequest, NotFound


class SubaccountNotFoundError(BadRequest):
    DETAIL = "Subaccount not found!"


class RobotNotFoundError(BadRequest):
    DETAIL = "Robot not found!"


class WorkerNotFoundError(NotFound):
    DETAIL = "Worker not found!"
