document.getElementById("updateBtn").addEventListener("click", async () => {
    let targetPrice = document.getElementById("targetPrice").value.trim();
    let newPrice = document.getElementById("newPrice").value.trim();

    if(!targetPrice || !newPrice){
        alert("Please enter both Target Price and New Price.");
        return;
    }

    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: updatePricesOnPage,
            args: [targetPrice, newPrice]
        });
    });
});

// Function to run in page context
function updatePricesOnPage(targetPrice, newPrice){
    let rows = document.querySelectorAll(".grid.align-items-center.text-xs");
    let count = 0;

    rows.forEach(row => {
        let spans = row.querySelectorAll("span");
        spans.forEach(span => {
            if(span.innerText.trim() === targetPrice){
                let input = row.querySelector("input.p-inputnumber-input");
                if(input){
                    input.value = newPrice;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    count++;
                }
            }
        });
    });

    alert("Updated " + count + " product(s) from " + targetPrice + " → " + newPrice);
}
