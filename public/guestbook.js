(function(){ 
  
  // helper function to listen for our db rows request
  const getGuestbookEntriesListener = function() {

    // parse our response to convert to JSON
    const guestbookEntries = JSON.parse(this.responseText);
    
    // for each entry in guestbookEntries, create a row for that entry
    // and append it to the table
    for (let i = 0; i < guestbookEntries.length; i++) {

      // call the addGuestbookRecord helper to create a row
      addGuestbookRecord(guestbookEntries[i].name, guestbookEntries[i].twitter, guestbookEntries[i].message);
    }
  }

  // use ajax to get our db entries and call the above getGuestbookEntriesListener 
  // to add those entries to our guestbook table
  var entryRequest = new XMLHttpRequest();
  entryRequest.onload = getGuestbookEntriesListener;
  entryRequest.open('get', '/getGuestbookEntries');
  entryRequest.send();
  
  // let's identify our form so we can use in other functions
  const guestbookForm = document.getElementsByTagName('form')[0];
  
  // a helper function for appending a row to our guestbook
  const addGuestbookRecord = function(name, twitter, message) {
    
    // create tr element
    const newRow = document.createElement('tr');

    // get current row count (minus the header row)
    const rowCount = guestbookTable.getElementsByTagName('tr').length - 1;
    
    // set the inner html of that element to have the record
    newRow.innerHTML = `<tr>
      <td>${rowCount + 1}</td>
      <td>${name}</td>
      <td><a href="https://twitter.com/${twitter}">@${twitter}</a></td>
      <td>${message}</td>
    </tr>`;

    // append that record to the table
    guestbookTable.appendChild(newRow)
  }
  
  // a helper function for cleaning our form submission values to prevent xss
  const cleanseString = function(string) {
    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // find the table in our guestbook
  const guestbookTable = document.getElementsByTagName('table')[0];

  // to handle the form submit, we need to add get the submit button
  const submitButton = document.getElementById('submitToGuestbook');
  
  // and we need to add an event handler to add our data to the guestbook when the submit button is clicked
  submitButton.onclick = function(e) {
    
    // this prevents the page from doing the default form submission,
    // which we want to control ourselves
    e.preventDefault();
    
    // we want to get our form 
    const guestbookForm = this.form;
    
    // we should validate it
    if ( !guestbookForm.name.value || !guestbookForm.twitter.value || !guestbookForm.message.value) {
      alert('you need to enter all values to post to my guestbook!') 
    }
    else {
      // and we want to append a new row with our cleansed data
      addGuestbookRecord(cleanseString(guestbookForm.name.value), cleanseString(guestbookForm.twitter.value), cleanseString(guestbookForm.message.value));
    }
    
    // now we want to actually submit the form before resetting it
    guestbookForm.submit();
    
    // and reset the form to prevent duplicate records by mistake
    guestbookForm.reset();
  }

})()