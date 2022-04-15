import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoading, Oval } from '@agney/react-loading';
import { connect } from './redux/blockchain/blockchainActions';
import { fetchData } from './redux/data/dataActions';
import * as s from './styles/globalStyles';
import styled from 'styled-components';
import BN from 'bn.js';
import logo from './assets/astar-pass.svg';
import { LinkPrimary } from './styles/Description.styled';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 16px 40px;
  border-radius: 10px;
  border: none;
  background-color: ${(props) => (props.disabled ? '#505050' : '#05B6FD')};
  width: 280px;
  height: 60px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: var(--secondary-text);
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: black;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  /* max-width: 392px; */
  /* min-width: 375px; */
  width: 340px;
  /* height: 392px; */
  justify-content: stretched;
  align-items: stretched;
  @media (min-width: 767px) {
    width: 390px;
    flex-direction: row;
  }
`;

export const StyledLink = styled.a`
  color: #b1b7c1;
  text-decoration: none;
`;

export const BuyButtonContent = styled.div`
  display: flex;
  align-items: center;
`;

const Mint = () => {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  // const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [feedback, setFeedback] = useState('');
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: '',
    SCAN_LINK: '',
    NETWORK: {
      NAME: '',
      SYMBOL: '',
      ID: 0,
    },
    NFT_NAME: '',
    SYMBOL: '',
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: '',
    MARKETPLACE_LINK: '',
    SHOW_BACKGROUND: false,
    PASS_NAME: '',
    PASS_LINK: '',
  });
  const MAX_MINT_AMOUNT = 1;
  const CAN_MINT = true;

  // Todo: Update price and ticker
  const price = 500;
  const isInvalidConnection =
    blockchain.account === '' || blockchain.smartContract === null;

  const { containerProps, indicatorEl } = useLoading({
    loading: claimingNft,
    indicator: <Oval width="24" />,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let gasPrice = CONFIG.GAS_PRICE;
    const symbol = CONFIG.SYMBOL;
    let totalCostWei = cost;
    let totalGasLimit = String(gasLimit);
    let value = data.isPassHolder ? 0 : totalCostWei;
    console.log('Cost: ', totalCostWei, cost);
    console.log('Gas limit: ', totalGasLimit);
    console.log('Gas price: ', gasPrice);
    console.log('totalGasLimit: ', totalGasLimit);
    console.log('value: ', value);
    console.log('data', data);

    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);

    blockchain.smartContract.methods
      .mint(1)
      .send({
        gasLimit: String(totalGasLimit),
        gasPrice: String(gasPrice),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: String(value),
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Sorry, something went wrong please try again later.');
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        // setFeedback(
        //   `WOW, the ${CONFIG.NFT_NAME} is yours! go visit ${CONFIG.MARKETPLACE} to view it.`
        // );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== '' && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch('/config/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <ResponsiveWrapper style={{ padding: 0 }} test>
      {/* <ResponsiveWrapper style={{ padding: 24 }} test> */}
      <s.Container
        flex={2}
        jc={'center'}
        ai={'center'}
        style={{
          background:
            'linear-gradient(352.45deg, #0C478C 10%, rgba(21, 37, 59, 0.44) 54%)',
          padding: 24,
          borderRadius: 20,
          border: '0px dashed var(--secondary)',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)',
        }}>
        <s.SpacerSmall />
        <s.TextTitle
          style={{
            textAlign: 'center',
            fontSize: 48,
            fontWeight: 'bold',
            color: 'white',
          }}>
          {data.totalSupply} / {CONFIG.MAX_SUPPLY}
        </s.TextTitle>
        <s.TextDescription
          style={{
            textAlign: 'center',
            color: 'white',
          }}>
          <StyledLink target={'_blank'} href={CONFIG.SCAN_LINK}>
            {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
          </StyledLink>
        </s.TextDescription>
        <StyledLink
          target={'_blank'}
          href={CONFIG.MARKETPLACE_LINK}
          style={{ marginBottom: 8 }}>
          {CONFIG.MARKETPLACE}
        </StyledLink>
        <s.SpacerSmall />
        {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
          <>
            <s.TextTitle
              style={{ textAlign: 'center', color: 'var(--accent-text)' }}>
              The sale has ended.
            </s.TextTitle>
            {/* <s.TextDescription
              style={{ textAlign: "center", color: "var(--accent-text)" }}
            >
              You can still find {CONFIG.NFT_NAME} on
            </s.TextDescription>
            <s.SpacerSmall />
            <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
              {CONFIG.MARKETPLACE}
            </StyledLink> */}
          </>
        ) : (
          <>
            {/* <s.TextTitle
              style={{ textAlign: 'center', color: 'var(--accent-text)' }}>
              1 {CONFIG.SYMBOL} costs{' '}
              {data.isPassHolder ? '0' : CONFIG.DISPLAY_COST}{' '}
              {CONFIG.NETWORK.SYMBOL}.
            </s.TextTitle> */}
            {isInvalidConnection ? (
              <div />
            ) : data.isRegistered ? (
              <>
                <s.TextTitle
                  style={{
                    textAlign: 'center',
                    color: 'var(--accent-text)',
                    fontSize: 14,
                    fontWeight: 400,
                    marginBottom: 10,
                  }}>
                  You have got
                </s.TextTitle>
                <img
                  src={logo}
                  alt="Astar pass logo"
                  style={{
                    height: 42,
                    width: 230,
                    marginBottom: 10,
                  }}
                />
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{
                    textAlign: 'center',
                    color: '#F2C94C',
                    fontSize: 14,
                    fontWeight: 400,
                    marginBottom: 10,
                  }}>
                  You don’t have AstarPass
                </s.TextTitle>
              </>
            )}
            <s.TextTitle
              style={{
                textAlign: 'center',
                color: 'var(--accent-text)',
                fontSize: 14,
                fontWeight: 400,
                marginBottom: 10,
              }}>
              1 {CONFIG.SYMBOL} costs {data.isPassHolder ? '0' : CONFIG.DISPLAY_COST}{' '}
              {CONFIG.NETWORK.SYMBOL} (Excluding gas fees.)
            </s.TextTitle>
            {/* <s.SpacerXSmall /> */}
            {/* <s.TextDescription
              style={{ textAlign: 'center', color: 'var(--accent-text)' }}>
              Excluding gas fees.
            </s.TextDescription> */}
            {/* <s.SpacerSmall /> */}
            {isInvalidConnection ? (
              <s.Container ai={'center'} jc={'center'}>
                <s.TextDescription
                  style={{
                    textAlign: 'center',
                    color: 'var(--accent-text)',
                  }}>
                  Connect to the {CONFIG.NETWORK.NAME} network
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledButton
                  disabled={!CAN_MINT}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(connect());
                    getData();
                  }}>
                  Connect
                </StyledButton>
                {blockchain.errorMsg !== '' ? (
                  <>
                    <s.SpacerSmall />
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                      }}>
                      {blockchain.errorMsg}
                    </s.TextDescription>
                  </>
                ) : null}
              </s.Container>
            ) : (
              <>
                <s.TextDescription
                  style={{
                    textAlign: 'center',
                    color: 'var(--accent-text)',
                  }}>
                  {feedback}
                </s.TextDescription>
                <s.SpacerMedium />
                {/* <s.Container ai={"center"} jc={"center"} fd={"row"}>
                  <StyledRoundButton
                    style={{ lineHeight: 0.4 }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      decrementMintAmount();
                    }}
                  >
                    -
                  </StyledRoundButton>
                  <s.SpacerMedium />
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >
                    {mintAmount}
                  </s.TextDescription>
                  <s.SpacerMedium />
                  <StyledRoundButton
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      incrementMintAmount();
                    }}
                  >
                    +
                  </StyledRoundButton>
                </s.Container> */}
                {/* <s.SpacerSmall /> */}
                <s.Container ai={'center'} jc={'center'} fd={'row'}>
                  {parseInt(data.balance) ? (
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                      }}>
                      WOW, {data.balance} {CONFIG.NFT_NAME} is yours! Visit{' '}
                      <LinkPrimary
                        href="https://tofunft.com/astar"
                        target="_blank">
                        {CONFIG.MARKETPLACE}
                      </LinkPrimary>{' '}
                      to view it.
                    </s.TextDescription>
                  ) : claimingNft ? (
                    <div>
                      <s.TextDescription
                        style={{
                          textAlign: 'center',
                          color: 'var(--accent-text)',
                          fontWeight: 700,
                          fontSize: 16,
                        }}>
                        Minting...
                      </s.TextDescription>
                    </div>
                  ) : (
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}>
                      <BuyButtonContent>
                        {claimingNft
                          ? indicatorEl
                          : data.isPassHolder
                          ? 'Mint for Free'
                          : 'Mint'}
                      </BuyButtonContent>
                    </StyledButton>
                  )}
                </s.Container>
              </>
            )}
          </>
        )}
        <s.SpacerMedium />
      </s.Container>
      {/* <s.SpacerLarge /> */}
      {/* <s.Container>
        <s.TextDescription
          style={{
            textAlign: 'center',
            color: 'var(--primary-text)',
          }}>
          To claim one free NFT you need to be an active staker in&nbsp;
          <StyledLink target={'_blank'} href={CONFIG.DAPPS_STAKING_LINK}>
            dApps Staking
          </StyledLink>
          &nbsp;on {CONFIG.NETWORK.NAME}&nbsp; and you need to be registered
          as&nbsp;
          <StyledLink target={'_blank'} href={CONFIG.PASS_LINK}>
            {CONFIG.PASS_NAME}
          </StyledLink>
          &nbsp; holder. Otherwise you can still mint 1 NFT but you need to pay.
        </s.TextDescription>
        <s.SpacerLarge />
        <s.TextDescription
          style={{
            textAlign: 'center',
            color: 'var(--primary-text)',
          }}>
          Please make sure you are connected to the right network (
          {CONFIG.NETWORK.NAME}) and the correct address. Please note: Once you
          make the purchase, you cannot undo this action.
        </s.TextDescription>
        <s.SpacerLarge />
      </s.Container> */}
    </ResponsiveWrapper>
  );
};

export default Mint;
