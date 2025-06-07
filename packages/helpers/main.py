def main():
    print("Hello from example-app!")

from faker import Faker
import random
import string

# Initialize Faker instance
faker = Faker()

def generate_player_name():
    # Allowed letters: A–Z excluding Q, X, Z, V
    allowed_letters = [ch for ch in string.ascii_uppercase if ch not in {'Q', 'X', 'Z', 'V'}]

    first = random.choice(allowed_letters)

    if random.random() < 0.10:
        # 10% chance to double the letter
        second = first
    else:
        # 90% chance to pick a different (or possibly same) letter randomly
        second = random.choice(allowed_letters)

    nickname = first + second

    last_name = faker.last_name()

    return f"{nickname} {last_name}"