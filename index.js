import { dates } from '/utils/dates'

const tickersArr = []

const generateReportBtn = document.querySelector('.generate-report-btn')

generateReportBtn.addEventListener('click', fetchStockData)

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const tickerInput = document.getElementById('ticker-input')
    if (tickerInput.value.length > 2) {
        generateReportBtn.disabled = false
        const newTickerStr = tickerInput.value
        tickersArr.push(newTickerStr.toUpperCase())
        tickerInput.value = ''
        renderTickers()
    } else {
        const label = document.getElementsByTagName('label')[0]
        label.style.color = 'red'
        label.textContent = 'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.'
    } 
})

function renderTickers() {
    const tickersDiv = document.querySelector('.ticker-choice-display');
    tickersDiv.innerHTML = '';
    
    if (tickersArr.length === 0) {
        tickersDiv.innerText = 'Your tickers will appear here...';
    } else {
        tickersArr.forEach((ticker) => {
            const newTickerSpan = document.createElement('span');
            newTickerSpan.textContent = ticker;
            newTickerSpan.classList.add('ticker');
            tickersDiv.appendChild(newTickerSpan);
        });
    }
}

const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')

async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    try {
        const stockData = await Promise.all(tickersArr.map(async (ticker) => {

            const workerUrl = "https://polygon-api-worker.fragrant-sun-84f5.workers.dev/";
            
            const queryParams = new URLSearchParams({
                ticker: ticker,
                startDate: dates.startDate,
                endDate: dates.endDate
            });

            const response = await fetch(`${workerUrl}?${queryParams}`);
            const data = await response.text()
            const status = response.status;
            
            if (status === 200) {
                apiMessage.innerText = 'Creating report...'
                return data
            } else {
                // If one fails, we throw an error to trigger the catch block
                throw new Error(`Failed to fetch ${ticker}: ${response.status}`);
            }
        }));

        const aiResponse = await fetchReport(stockData.join(''));

        // OpenAI returns a complex object, so we extract the text.
        const reportText = aiResponse.choices[0].message.content;

        renderReport(reportText);

    } catch (err) {
        loadingArea.innerText = 'There was an error fetching stock data.'
        console.error("Diagnostic log:", err.message);
    }
}

async function fetchReport(data) {
    const messages = [
        {
            role: 'system',
            content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.'
        },
        {
            role: 'user',
            content: `
            ###
            Example 1
            Data: AAPL: 160, 165, 170
            Report: OK baby, hold on tight! Apple is going stratospheric...
            ###

            ###
            Example 2
            Data: TSLA: 250, 240, 230
            Report: You are going to haate this! Tesla is plummeting...
            ###

            Data: ${data}
            Report: `
        }
    ]

    try {

        const url = "https://openai-api-worker.fragrant-sun-84f5.workers.dev/";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({messages})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reportData = await response.json();
        return reportData;
    } catch (err) {
        console.error("Full error details:", err); // Gives more info that just message.
        loadingArea.innerText = 'Unable to access AI. Please refresh and try again'
    }
}

function renderReport(output) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')

    // 1. Clear previous content (removes old reports or buttons).
    outputArea.innerHTML = '<h2>Your Report 😜</h2>';

    // 2.  Add report text.
    const report = document.createElement('p');
    outputArea.appendChild(report)
    report.textContent = output

    // NEW: Show the button container underneath
    document.getElementById('reset-container').classList.add('visible');
    
    // Ensure the event listener is attached (do this once at top of file instead)
    document.getElementById('new-report-btn').onclick = resetApp;

    outputArea.style.display = 'flex'
}

function resetApp() {
    // 1. Hide the output panel and the button container.
    document.querySelector('.output-panel').style.display = 'none';
    document.getElementById('reset-container').classList.remove('visible');

    // 2. SHOW the input panel again.
    document.querySelector('.action-panel').style.display = 'flex';

    // 3. Clear the tickers array and update the UI display.
    tickersArr.length = 0; 
    renderTickers();

    // 4. Disable the generate button again for the next round.
    generateReportBtn.disabled = true;
}
