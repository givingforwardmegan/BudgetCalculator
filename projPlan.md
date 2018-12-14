
# Fundamental Planning
1. Add event handler to add/remove
2. Get input values
3. Add new item to our data structure
4. Add new item to our UI
5. Caluclate budget
6. Update UI

*use modules to structure code in order to keep similar code together in organized units*

UI Module
- get input values
- add new item to ui
- update the budget ui
---------------------------------
Data Module
- add new item to data structure
- calculate budget 
---------------------------------
Controller Module
- add event handler



# Planning Second Portion

1. Add event handler to 'x'
2. Delete the item from the data structure
3. Delete the item from to the UI
4. Recalculate the budget
5. Update the UI

## Event Delegation

**event bubbling** when event is fired/triggered on DOM element (clicking), the exact same event is triggered on ALL of the parent elements - one at a time. "bubbles up inside the DOM tree"
- element that caused the event to happen is the 

**target element**
  - Target el. stored as a property in the Event Object
  
**event delegation** Don't setup the event on the original element, but to attach to a parent element and catch the event. (attach an event handler to the parent el and wait for it to bubble up to handle.)

Why event delegation?:
- when you have an el with lots of child el that we're interested in
- when we want an event handler attached to an el that is not yet in the DOM when our page is loaded
