import React, { useEffect, useState } from 'react';
import {useWallet} from "@solana/wallet-adapter-react";
import {Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {decodeMetadata, getMetadataAccount} from "../../MetadataService";
import {makeStyles} from "@mui/styles";
import {GmootCard} from "../GmootCard";
import {Rarities} from "../../resources/rarities";

const useStyles = makeStyles({
  display: {
    marginRight: '24px',
    marginLeft: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(276px, 1fr))',
  }
});

const fetchData = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
}

export const GmootDisplay = () => {
  const classes = useStyles();
  const { publicKey, wallet, connected } = useWallet();
  const [gmoots, setGmoots] = useState([<div></div>]);

  useEffect(() => {
    if (publicKey) {
      getGmoots(publicKey)
        .then(gmootInfos => {
          gmootInfos.sort(function(a,b) {
            return Rarities.indexOf(a.number) - Rarities.indexOf(b.number)
          })
          let allGmoots = gmootInfos.map(gmootInfo =>
            <GmootCard img={gmootInfo.img} name={gmootInfo.name} rank={(Rarities.indexOf(gmootInfo.number) + 1).toString()}/>
          )
          setGmoots(allGmoots)
        });
    }
  }, [connected, wallet, publicKey])

  return (
    <div className={classes.display}>
      {gmoots.length === 0 ? <div>No Gmoots to be found!</div> : gmoots.map(gmoot => gmoot)}
    </div>
  );
}

const getGmoots = async (publicKey: PublicKey) => {
  let connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  let response = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    },
  );

  let mints = await Promise.all(response.value
    .filter(accInfo => accInfo.account.data.parsed.info.tokenAmount.uiAmount !== 0)
    .map(accInfo => getMetadataAccount(accInfo.account.data.parsed.info.mint))
  );

  let mintPubkeys = mints.map(m => new PublicKey(m));

  let multipleAccounts = await connection.getMultipleAccountsInfo(mintPubkeys);

  let nftMetadata = multipleAccounts.filter(account => account !== null).map(account => decodeMetadata(account!.data));

  let gmootInfo = await Promise.all(nftMetadata.filter(metaData => metaData!.data.name.includes('gmoot'))
    .map(async metaData => {
      let arWeaveData = await fetchData(metaData!.data.uri);
      return {
        img: arWeaveData!.image,
        name: metaData!.data.name,
        number: metaData!.data.name.replace(/\D/g,'')
      }
  }));
  console.log(gmootInfo);

  return gmootInfo;

}