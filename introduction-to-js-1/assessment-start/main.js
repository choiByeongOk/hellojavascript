const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
var story = document.querySelector('.story');
customName.focus();

function randomValueFromArray(array){
    const random = Math.floor(Math.random()*array.length);
    return array[random];
}

const storyText = 'It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.';
const insertX = ['Willy the Goblin', 'Big Daddy', 'Father Christmas'];
const insertY = ['the soup kitchen', 'Disneyland', 'the White House'];
const insertZ = ['spontaneously combusted', 'melted into a puddle on the sidewalk', 'turned into a slug and crawled away'];

// Adds a click event listener to the randomize variable so that when the button it represents is clicked, the result() function is run.
randomize.addEventListener('click', result);
// Adds a partially-completed result() function definiton to your code. For the remainder of the assessment, you'll be filling in lines inside this function to complete it and make it work properly.

function result() {
    let newStory = storyText;
    let xItem = randomValueFromArray(insertX);
    let yItem = randomValueFromArray(insertY);
    let zItem = randomValueFromArray(insertZ);

    newStory = newStory.replace(/:insertx:/g, xItem)
        .replace(':inserty:', yItem)
        .replace(':insertz:', zItem);

    let name = customName.value;
    if (name !== '') {
        newStory.replace('Bob', name);
    }

    if (document.getElementById('uk').checked) {
        let weight = Math.round(300 * 0.071429) + ' stone';
        let temperature = Math.round(5/9 * (94-32)) + ' centigrade';

        newStory = newStory.replace('300 pounds', weight)
            .replace('94 fahrenheit', temperature);
    }

    story.textContent = newStory;
    story.style["backgroundColor"] = 'yellow';
    story.style.visibility = 'visible';
}
