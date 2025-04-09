# chalkland



# map seed 983604060 https://azgaar.github.io/Fantasy-Map-Generator/



# Pydantic
The mode parameter is the key control mechanism here. By setting mode="before" on both validators, you're explicitly telling Pydantic when to run each validator in its processing pipeline.
If you had used mode="after" instead, those validators would run after type conversion and basic validation. The specific ordering between model-level and field-level validators is part of Pydantic's design to ensure a logical flow of data processing.