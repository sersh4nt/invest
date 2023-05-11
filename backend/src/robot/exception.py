from src.exceptions import BadRequest


class SubaccountNotFoundError(BadRequest):
    DETAIL = "Subaccount not found!"


class RobotNotFoundError(BadRequest):
    DETAIL = "Robot not found!"
