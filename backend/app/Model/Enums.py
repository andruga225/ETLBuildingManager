import enum


class DataType(enum.Enum):
    int = 1
    float = 2
    text = 3
    date = 4
    bool = 5
    coordinates = 6

# class Operator(enum.Enum):
#     Less = 1
#     Greater = 2
#     Equal = 3
#     LessOrEqual = 4
#     GreaterOrEqual = 5


class Source(enum.Enum):
    local = 1
    ethernet = 2



