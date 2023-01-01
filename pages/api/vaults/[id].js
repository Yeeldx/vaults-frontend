export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    fetch("https://yeeldx.github.io/data/vaults.json")
    .then((response) => {
      console.log("response : ", response);
      return response.json();
    })
    .then((result) => {
      let vault = result.filter((value, index) => {
        if (value.address == req.query.id) {
          return value;
        }
      })[0];

      res.status(200).json({ data: vault });
    });
  });
}
