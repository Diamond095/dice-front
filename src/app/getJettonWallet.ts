import React, { useState } from 'react';
import axios from 'axios';

export const getJettonWallet = async (userAddress, token) => {
  let jettonMaster = null;
  let jettonWallet = null;
  if (token == "m5") {
      jettonMaster = 'EQBa6Oofc4vQZ1XZLTYRkbX4qWUWBCf0sFBgo0kdxdlw6rqN'
  }
  try {
    const response = axios.get('https://toncenter.com/api/v3/jetton/wallets', {
      params: {
        owner_address: userAddress,
        jetton_address: jettonMaster
      }
    })
    const data = await response;
   console.log(data)
    console.log(data.data.jetton_wallets[0].address);
    jettonWallet = data.data.address_book[data.data.jetton_wallets[0].address]
    return jettonWallet.user_friendly
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;

  }
};
