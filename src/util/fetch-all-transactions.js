/*
 * This is a convenience function to fetch all transactions automatically through the Chrome console.
 *
 * HOW TO:
 * 
 * Log in to Koinly and go to the transactions page:
 *   https://app.koinly.io/p/transactions?order=date&page=1&perPage=25
 * Set up your filter criteria, open the Network tab in the Chrome Dev Tools and reload the page.
 * Copy and paste the `fetchAll` function into the Chrome Dev Tools console.
 * In the network tab, look for the request with a name like this:
 *   transactions?order=date&per_page=25&page=1
 * Right click it > Copy > Copy as fetch.
 * Paste the fetch statement into the Chrome Dev Tools console.
 * Edit the `fetch` function name to `fetchAll`.
 * Press enter and wait for the transactions to be printed to the console.
 * Copy the transactions output from the console and save it to a file.
 *
 */
async function fetchAll(url, options) {
    let totalPages = undefined
    let transactions = []
    let nextPage = 1
    url = url.replace(/&page=\d+/, '')
    do {
        let urlWithPage = url + '&page=' + nextPage
        let resp = await fetch(urlWithPage, options)
        let json = await resp.json()
        nextPage = nextPage + 1
        totalPages = json.meta.page.total_pages
        transactions.push.apply(transactions, json.transactions)

    } while (nextPage <= totalPages);
    console.log(JSON.stringify(transactions))
}

