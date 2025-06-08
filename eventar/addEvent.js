const submitBtn = document.getElementById("submit-form");

submitBtn.addEventListener("click", e =>{

    const newEvent = {
        date:document.getElementById("date").value,
        noYear:Boolean(document.getElementById("no-year").value),
        title:document.getElementById("title").value,
        eventType:document.getElementById("event_type").value,
        description:document.getElementById("description").value,
        imageURL:document.getElementById("img-url").value,
        title:document.getElementById("title").value
    }

    newEventJson = JSON.stringify(newEvent);


    alert(newEventJson);

})