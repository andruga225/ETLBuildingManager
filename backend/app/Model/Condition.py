
class Condition:
    id = None
    table_name = None # DbTable class
    attribute = None  # string
    operator = ""  # string
    value = None  # object
    logic_operator = ""

    def __init__(self, id, table_name, attribute, operator, value, logic_operator=""):
        self.id = id
        self.table_name = table_name
        self.attribute = attribute
        self.operator = operator
        self.value = value
        self.logic_operator = logic_operator

    def __eq__(self, other):
        return self.id == other.id

    def __str__(self):
        return f"{self.logic_operator} {self.attribute} {self.operator} %s"
