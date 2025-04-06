import plotly.graph_objects as go
import numpy as np
import random
import pytest
from packages.models.main import main

# Call the main function
def test_main():
    """
    Tests that the repo is properly setup as a mono repo with communicating scripts
    """
    main()