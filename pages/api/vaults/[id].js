let valuts = [
    {
      "address": "0xdeD8B4ac5a4a1D70D633a87A22d9a7A8851bEa1b",
      "symbol": "yxcurve-tricrypto",
      "display_symbol": "yxcurve-tricrypto",
      "formated_symbol": "yxcrv3crypto",
      "name": "Curve Tricrypto Vault",
      "display_name": "Curve Tricrypto Vault",
      "formated_name": "Curve Tricrypto Vault yeeldx",
      "icon": "https://raw.githubusercontent.com/yearn/yearn-assets/master/icons/multichain-tokens/42161/0x239e14A19DFF93a17339DCC444f74406C17f8E67/logo-128.png",
      "version": "0.1.0",
      "type": "v2",
      "category": "Curve",
      "inception": 1642730468,
      "decimals": 18,
      "riskScore": 0,
      "endorsed": true,
      "emergency_shutdown": false,
      "buyToken" : "https://arbitrum.curve.fi/tricrypto/deposit",
      "token": {
        "address": "0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2",
        "name": "Curve.fi USD-BTC-ETH",
        "symbol": "crv3crypto",
        "type": "",
        "display_name": "Curve triCrypto Pool",
        "display_symbol": "crvTricrypto",
        "description": "This token represents a Curve liquidity pool. Holders earn fees from users trading in the pool, and can also deposit the LP to Curve's gauges to earn CRV emissions. This crypto pool contains USDT, WBTC, and WETH. Please be aware that as crypto pools are composed of differently-priced assets, they are subject to impermanent loss.",
        "icon": "https://raw.githubusercontent.com/yearn/yearn-assets/master/icons/multichain-tokens/42161/0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2/logo-128.png",
        "decimals": 18
      },
      "tvl": {
        "total_assets": "205143256269417402188",
        "total_delegated_assets": "0",
        "tvl_deposited": 171523.60193904402,
        "tvl_delegated": 0,
        "tvl": 171523.60193904402,
        "price": 836.11621
      },
      "apy": {
        "type": "v2:averaged",
        "gross_apr": 0.0503206648712262,
        "net_apy": 0.024547320150957397,
        "fees": {
          "performance": 0.2,
          "withdrawal": 0,
          "management": 0.02,
          "keep_crv": 0,
          "cvx_keep_crv": 0
        },
        "points": {
          "week_ago": 0.014357712287245139,
          "month_ago": 0.024547320150957397,
          "inception": 0.12581080779641618
        },
        "composite": {
          "boost": 0,
          "pool_apy": 0,
          "boosted_apr": 0,
          "base_apr": 0,
          "cvx_apr": 0,
          "rewards_apr": 0
        }
      },
      "details": {
        "management": "0x7EE536e1FC3638EAdF5be06E8dCC562BDccBc340",
        "governance": "0x2A5e98520fcA96D068542c245880354D233C3E64",
        "guardian": "0x73d82dd7E3053Fd268F4ee3c1d61b0df9F233b12",
        "rewards": "0x56a394cCa23c90EE1Ec39F05Abb1CA18C95bC4D4",
        "depositLimit": "10000000000000000000000",
        "availableDepositLimit": "9999983100287390734522",
        "comment": "Curve Tricrypto",
        "apyTypeOverride": "",
        "apyOverride": 0,
        "order": 0,
        "performanceFee": 1000,
        "managementFee": 200,
        "depositsDisabled": false,
        "withdrawalsDisabled": false,
        "allowZapIn": false,
        "allowZapOut": false,
        "retired": false,
        "hideAlways": false
      },
      "strategies": [
        {
          "address": "0xc4d80C55dc12FF0f2b8680eC31A6ADC4cbC8Dfca",
          "name": "CurveTriCryptoStrategy",
          "description": "Supplies {{token}} to [Curve Finance](https://arbitrum.curve.fi) and stakes it in gauge to collect any available tokens and earn CRV rewards. Earned tokens are harvested, sold for more {{token}} which is deposited back into the strategy."
        }
      ],
      "migration": {
        "available": false,
        "address": "0x239e14A19DFF93a17339DCC444f74406C17f8E67",
        "contract": "0x0000000000000000000000000000000000000000"
      }
    }
  ]
  
export default function handler(req, res) {
    let vault = valuts.filter((value, index) => {
        if (value.address == req.query.id) {
            return value;
        }
    })[0];

    res.status(200).json({ data: vault })
}