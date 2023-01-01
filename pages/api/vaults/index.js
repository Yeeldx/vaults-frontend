export default function handler(req, res) {
    fetch("https://yeeldx.github.io/data/vaults.json")
    .then(response => response.json())
    .then((result) => {
        res.status(200).json({ data: result, pagination: { total: result.length } })
    })
    
}