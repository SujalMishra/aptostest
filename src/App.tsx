import React from 'react';
import { useEffect, useState } from "react";
import { Layout, Row, Col,Button, Flex } from "antd";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Provider, Network } from "aptos";  
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
export const provider = new Provider(Network.TESTNET);
// change this to be your module account address
export const moduleAddress = "0x2d864126b0acbd08e20b01421b08693048c087f631cf287603c5bf073289d6f2";
const nftMintAddr = "0x5fec4a8cba4ff028e794a7ac532e1dd65cd78800966b562671ec6a1b587fa1ad"
const dao_addr = "0x3a7e69b2a8278b89132f37fa2241563692cc22d7ec376048579de7dddd387c6f"

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  // useEffect(() => {
  //   // fetchList();
  // }, [account?.address]);
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [proposals, setProposals] = useState<any>([]);
  const [proposalForm ,setProposalForm] = useState<any>({
    title: "",  
    description: "",
    duration  : 0,
    functionToCall: "",
  });

  const [voteForm ,setVoteForm] = useState<any>({
    tokenName: "",
    propertyVersion: 0,
  });
 
  const getProposals = async () => {
     if(!account) return [];
     
     try {
      const prop =  await provider.getAccountResource(
        account.address,
        `${dao_addr}::nft_dao::Proposals`,
       );
      //  setProposals(prop);
      console.log(prop);
       setAccountHasList(true);
      
     }catch(error: any) {
        setAccountHasList(false);
        console.log(error);
      }
  }

  
  const addNewList = async () => {
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::nft_dao::get_proposal`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    }
  };

  const getNFT = async () => {
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${nftMintAddr}::simple_defi::mint_event_ticket2`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      console.log(response);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    }
  }

  const handleChange = (event: any) => {
    setProposalForm({
      ...proposalForm,
      [event.target.name]: event.target.value,
    });
  };
  const handleChange1 = (event: any) => {
      setVoteForm({
        ...voteForm,
        [event.target.name]: event.target.value,
      });

  }
   
  const create_proposal = async (event: any) => {
    console.log(proposalForm.title + proposalForm.description + proposalForm.duration + proposalForm.functionToCall);
    event.preventDefault();
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::nft_dao::create_proposal`,
      type_arguments: [],
      arguments: [
        `${dao_addr}`,
        proposalForm.title,
        proposalForm.description,
        proposalForm.functionToCall,
        [],
        [],
        [],
        proposalForm.duration,
        ["T22 NFT Pass"],
        [1]  
      ],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    }
    
  };

  const resolve = async () => {
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::nft_dao::resolve_proposal`,
      type_arguments: [],
      arguments: [[[1]]],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      console.log(response);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    }
  }
  const vote = async (event: any) => {
    console.log("df"+voteForm.tokenName + voteForm.propertyVersion);
    event.preventDefault();
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::nft_dao::vote`,
      type_arguments: [],
      arguments: [
        `${dao_addr}`,
        3,
        true,
        [voteForm.tokenName],
        [voteForm.propertyVersion]
      ],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    }
  }

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Our todolist</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
        <Button onClick={addNewList} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
          Add new list
        </Button>
      </Layout>

      {/* To get Membersship */}
      <div>
        <h1>To participate in DAO get nft </h1>
        <Button onClick={getNFT} block type="primary" style={{ width:"200px",height: "40px", backgroundColor: "#3f67ff" }}>Get NFT</Button>
      </div>

      {/* To create Proposal */}
      <div className='proposal'>
          <h1>Create Proposal</h1>
        <div>
           
            <form onSubmit={create_proposal}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={proposalForm.title}
                onChange={handleChange}
                required
              />
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={proposalForm.description}
                onChange={handleChange}
                required
              ></input>
            </div>
            <div>
              <label htmlFor="duration">Start Time:</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={proposalForm.duration}
                onChange={handleChange}
                required
              />
              <label htmlFor="functionToCall">Function To Call:</label>
              <input
                type="text"
                id="functionToCall"
                name="functionToCall"
                value={proposalForm.functionToCall}
                onChange={handleChange}
                required
              />
            
            </div>
            <button type="submit">Submit Proposal</button>
            </form> 
          
        </div>
      </div>

      {/* To resolve  */}
      <div>
            <Button onClick={resolve}>Resolve</Button>
      </div>

      {/* To vote on Proposal */}
      <div>
        <h1>Vote on Proposal</h1>
        <div>
          <form onSubmit={vote}>
            <div>
               <label htmlFor="title">Token Name:</label>
              <input
                type="text"
                id="tokenName"
                name="tokenName"
                value={proposalForm.tokenName}
                onChange={handleChange1}
                required
              />
              <label htmlFor="title">Property Version:</label>
              <input
                type="number"
                id="propertyVersion"
                name="propertyVersion"
                value={proposalForm.propertyVersion}
                onChange={handleChange1}
                required
              />
            </div>
            <button type="submit">Vote</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
