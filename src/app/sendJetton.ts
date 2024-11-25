import { beginCell, toNano, Address, Cell } from '@ton/core';
import { TonConnectUI } from '@tonconnect/ui-react';
import axios from 'axios';


export const sendJetton = async (code: string, token: string, amount: number, myWallet: string, tonConnectUIInstance: any) => {

    let body;
    let jettonMaster;
    let jettonWallet = null;
    let response;
    let commentCell = beginCell()
    .storeUint(0, 32)        
    .storeStringTail(code)     
    .endCell(); 
    switch (token) {
        case "m5":
            jettonMaster = 'EQBa6Oofc4vQZ1XZLTYRkbX4qWUWBCf0sFBgo0kdxdlw6rqN'
            body = beginCell()
                .storeUint(0xf8a7ea5, 32)              
                .storeUint(0, 64)                        
                .storeCoins(toNano(amount))               
                .storeAddress(Address.parse('UQBqxzwzycHNLxaPEhrN4TreSNS5gdOlm0iPDMD804EDsiiH'))
                .storeAddress(Address.parse('UQBqxzwzycHNLxaPEhrN4TreSNS5gdOlm0iPDMD804EDsiiH'))    
                .storeUint(0, 1)                   
                .storeCoins(toNano(0))                 
                .storeUint(0, 1)                         
                .endCell();
                response = await axios.get('https://toncenter.com/api/v3/jetton/wallets', {
                    params: {
                        owner_address: myWallet,
                        jetton_address: jettonMaster
                    }
                })
                jettonWallet = response.data.address_book[response.data.jetton_wallets[0].address].user_friendly
                break
                case "dfc":
                    jettonMaster = 'EQD26zcd6Cqpz7WyLKVH8x_cD6D7tBrom6hKcycv8L8hV0GP'
                    body = beginCell()
                        .storeUint(0xf8a7ea5, 32)              
                        .storeUint(0, 64)                        
                        .storeCoins(toNano(amount))               
                        .storeAddress(Address.parse('UQBqxzwzycHNLxaPEhrN4TreSNS5gdOlm0iPDMD804EDsiiH'))
                        .storeAddress(Address.parse('UQBqxzwzycHNLxaPEhrN4TreSNS5gdOlm0iPDMD804EDsiiH'))    
                        .storeUint(0, 1)                   
                        .storeCoins(toNano(0))                 
                        .storeUint(0, 1)                         
                        .endCell();
                        response = await axios.get('https://toncenter.com/api/v3/jetton/wallets', {
                            params: {
                                owner_address: myWallet,
                                jetton_address: jettonMaster
                            }
                        })
                        jettonWallet = response.data.address_book[response.data.jetton_wallets[0].address].user_friendly
                        break
    } 

    const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: body ? [
            {
                address: jettonWallet, 
                amount: toNano(0.075).toString(),
                payload: beginCell()
                .storeSlice(body.beginParse())  // Преобразуем Cell в Slice
                .storeSlice(commentCell.beginParse())  // Преобразуем Cell в Slice
                .endCell().toBoc().toString("base64")
            }
        ] : [{
            address: 'UQBqxzwzycHNLxaPEhrN4TreSNS5gdOlm0iPDMD804EDsiiH',
            amount: toNano(amount).toString(),
            payload:commentCell.toBoc().toString("base64")
        }]
    }
    const { boc } = await tonConnectUIInstance.sendTransaction(myTransaction);
    const inMsgCell = Cell.fromBase64(boc);
    const inMsgHash = inMsgCell.hash();
    const inMsgHashBase64 = inMsgHash.toString('hex');
    return code;
};
