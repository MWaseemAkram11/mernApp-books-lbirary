/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import uploadImg from '../../assets/images/photo.png';
import { Form, Button, Row, Modal, Accordion, Dropdown, FormGroup } from 'react-bootstrap';
import TokenAbi from '../../utils/token20Abi';
import './createpool.css';
import { create } from 'ipfs-http-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamation, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { encode } from 'js-base64';
import Info from '../InfoBtn/info';
import { ethers } from 'ethers';
import ErrorLabels from '../ErrorLabels/errorlabels';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import ContractAbi from '../../utils/contractAbi.json';
import ethContractAbi from '../../utils/ethContractAbi.json';
import Alerts from '../Alerts/alert';
import Card from 'react-bootstrap/Card';
import Web3 from 'web3';
import { createPool } from '../../redux/pool/pool.action';
import { useDispatch } from 'react-redux';
import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { useAccount, useNetwork } from 'wagmi';
import { platformSupportedChains } from '../../config/config';
import { toWeiValue } from '../../utils/globalHelpers';
import { TailSpin } from 'react-loader-spinner';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import IDOClock from '../ProductPage/idoClock';


const projectId = '2IgAtCMut1uyYqbIB9ZF2bSC7Kr'; // <---------- your Infura Project ID
const projectSecret = 'c04ed2d487eef3a347902ef7cbafa984'; // <---------- your Infura Secret
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

function Createpool(props) {
  //** libraries & modules **//
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const navigate = useNavigate();

  //** all state variables **//
  const [acc, setAcc] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [poolName, setPoolName] = useState('');
  const [selectedBiddingToken, setSelectedBiddingToken] = useState('');
  const [bidName, setBidName] = useState('');
  const [poolBalErr] = useState('');
  const [bidBalErr, setBidBalErr] = useState('');
  const [alert, setAlert] = useState('');
  var myRef = useRef([]);
  const [network] = useState([]);
  const [biddingToken] = useState([]);
  const [sDate, setSDate] = useState(new Date().toUTCString());
  const [eDate, setEDate] = useState(new Date().toUTCString());
  const [cDate, setCDate] = useState(new Date().toUTCString());
  const [logoError, setLogoError] = useState('');
  const [networkError, setNetworkError] = useState('');
  const [identityDocError, setIdentityDocError] = useState('');
  const [isCreated, setIsCreated] = useState(false);
  const [docIdentity, setDocIdentity] = useState(false);
  const [newErrState, setNewErrState] = useState({
    title: '',
    description: '',
    network: '',
    poolingToken: '',
    biddingToken: '',
    logo: '',
    poolStartDate: '',
    poolEndDate: '',
    poolCancelDate: '',
    hash: '',
    poolSellAmount: '',
    minimumBuyAmount: '',
    minimumBiddingAmount: '',
    minimumFundingThreshold: '',
    isKyc: true,
    isFinalize: false,
    name: '',
    email: '',
    phone: '',
    message: '',
    identityDoc: '',
    website: '',
    telegram: '',
    podcast: '',
    medium: '',
    twitter: '',
  });
  const [poolMeta, setPoolMeta] = useState({
    title: '',
    description: '',
    network: 'Select A Network',
    poolingToken: '', //address
    biddingToken: 'Select Bidding Token',
    logo: '',
    poolStartDate: new Date(),
    poolEndDate: new Date(),
    poolCancelDate: new Date(),
    hash: '',
    poolSellAmount: '',
    minimumBuyAmount: '',
    minimumBiddingAmount: '',
    minimumFundingThreshold: '',
    isKyc: true,
    isFinalize: false,
    poolType: 'public',
    name: '',
    email: '',
    phone: '',
    message: '',
    identityDoc: '',
    website: '',
    telegram: '',
    podcast: '',
    medium: '',
    twitter: '',
    whitePaper: '',
  });
  const [poolBalance, setPoolBalance] = useState(0);
  const [poolId, setPoolId] = useState(null);
  const [errors, setErrors] = useState({});
  const [apTok1, setApTok1] = useState(false);
  const [apTok2, setApTok2] = useState(false); //flag for token 2
  const [modalShow, setModalShow] = React.useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [descripBool, setDescripBool] = useState(false);

  //** useEffect & dependencies **//
  useEffect(() => {
    if (address !== undefined) {
      setAcc(address.toLocaleLowerCase());
    }
  }, [address]);

  useEffect(() => {
    const chainContract = Object.values(platformSupportedChains);
    chainContract.forEach(item => {
      if (!network.includes(item.name)) {
        network.push(item.name);
      }
    });
  }, []);

  //** all the logical functions **//
  const handleNetwork = async network => {
    const { ethereum } = window;
    if (network !== '' && network !== undefined && network !== 'Select A Network') {
      setNetworkError('');
      const map = new Map();
      const chainContract = Object.values(platformSupportedChains);
      chainContract.forEach(item => {
        if (item.name === network) {
          item.stableCoins.forEach(res => {
            if (biddingToken.length === 0 || biddingToken.length < 4) {
              biddingToken.push(res);
            }
          });
        }
      });

      if (network === 'Goerli Testnet') {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }],
          });
          setPoolName('');
          setPoolMeta({
            ...poolMeta,
            network: 'Goerli Testnet',
            poolingToken: '',
          });
          setErrors({ ...errors, poolingToken: '' });
        } catch (addError) {}
      } else if (network === 'BSC Testnet') {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }],
          });
          setBidName('');
          setPoolMeta({
            ...poolMeta,
            network: 'BSC Testnet',
            poolingToken: '',
          });
          setErrors({ ...errors, poolingToken: '' });
        } catch (addError) {}
      }
    } else {
      setNetworkError({ ...networkError, networkErr: 'Please Select a network' });
    }
  };

  const handleBiddingToken = async token => {
    setPoolMeta({ ...poolMeta, biddingToken: token.name });
    setSelectedBiddingToken(token.address);
    const contract = await FetchProvider(token.address, TokenAbi);
    setBidName('');
    if (contract !== undefined) {
      setErrors({ ...errors, biddingToken: '' });
      setBidName('loading');
      contract
        .name()
        .then(res => {
          if (res !== poolName) {
            setBidName(res);
          } else {
            setErrors({
              ...errors,
              biddingToken: 'Both tokens address cannot be same',
            });
          }
        })
        .catch(err => {
          setBidName('');
          if (poolMeta.network == 'Goerli Testnet') {
            setErrors({
              ...errors,
              biddingToken: 'Enter valid ERC20 token address',
            });
          } else {
            setErrors({
              ...errors,
              biddingToken: 'Enter valid BEP20 token address',
            });
          }
        });
    } else {
      setErrors({
        ...errors,
        biddingToken: 'Enter valid address',
      });
    }
  };

  const handleStartDate = e => {
    console.log(`start Date--`, e[0]);
    setSDate(e[0]);
    setPoolMeta({ ...poolMeta, poolStartDate: (Date.parse(e[0])) / 1000 });
    setErrors({ ...errors, poolStartDate: '' });
  };

  const handleEndDate = e => {
    console.log(`end date ---`, e[0])
    setEDate(e[0]);
    setPoolMeta({ ...poolMeta, poolEndDate: (Date.parse(e[0])) / 1000 });
    setErrors({ ...errors, poolEndDate: '' });
  };

  const handleCancelDate = e => {
    console.log(`cancel date ---`, e[0])
    setCDate(e[0]);
    setPoolMeta({ ...poolMeta, poolCancelDate: (Date.parse(e[0])) / 1000 });
    setErrors({ ...errors, poolCancelDate: '' });
  };

  const handleLogoChange = () => {
    setPoolMeta({ ...poolMeta, logo: '' });
    setLogoError('Please select logo');
  };

  const handleIdentityDocChange = () => {
    setPoolMeta({ ...poolMeta, identityDoc: '' });
    setIdentityDocError('Please select identity document');
  };

  const errorsRemoveHandler = () => {
    if (poolMeta?.title !== '' && poolMeta?.title !== undefined) {
      setErrors({ ...errors, title: '' });
    }
    if (poolMeta?.description !== '' && poolMeta?.description !== undefined) {
      setErrors({ ...errors, description: '' });
    }
    if (poolMeta?.name !== '' && poolMeta?.name !== undefined) {
      setErrors({ ...errors, name: '' });
    }
    if (poolMeta?.email !== '' && poolMeta?.email !== undefined) {
      setErrors({ ...errors, email: '' });
    }
    if (poolMeta?.phone !== '' && poolMeta?.phone !== undefined) {
      setErrors({ ...errors, phone: '' });
    }
    if (poolMeta?.website !== '' && poolMeta?.website !== undefined) {
      setErrors({ ...errors, website: '' });
    }
    if (poolMeta?.poolingToken !== '' && poolMeta?.poolingToken !== undefined) {
      setErrors({ ...errors, poolingToken: '' });
    }
  };

  const handleChange = async e => {
    const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const regexNumber = new RegExp(/"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"/gim);
    const regexName = function newFunctionStr2(str) {
      const res =
        /^[A-Za-z\s]*$/.test(str) &&
        /[A-Za-z]/.test(str) &&
        // /\s/.test(str) &&
        /^[^\s]/.test(str);
      return res;
    };
    const regexName1 = /^\S.*[a-zA-Z\s]*$/g;
    // e.preventDefault()
    const { name, value } = e.target;
    if (name === 'logo') {
      setDocLoading(true);
      const file = e.target.files[0];
      setLogoError('');
      if (checkMimeType(e)) {
        const logoUrl = await client.add(file);
        const url = `${logoUrl.path}`;
        setPoolMeta({ ...poolMeta, [name]: url });
        setTimeout(() => setDocLoading(false), 3000);
      } else {
        Swal.fire('Failed! Please select correct Image Format', 'Supported files ["png", "jpg", "jpeg", "gif"]', 'error');
      }
    } else if (name === 'title') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, title: '' });
    } else if (name === 'description') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, description: '' });
    } else if (name === 'poolSellAmount') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, poolSellAmount: '' });
    } else if (name === 'minimumBuyAmount') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, minimumBuyAmount: '' });
    } else if (name === 'minimumBiddingAmount') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, minimumBiddingAmount: '' });
    } else if (name === 'minimumFundingThreshold') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, minimumFundingThreshold: '' });
    } else if (name === 'name') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, name: '' });
    } else if (name === 'email') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, email: '' });
    } else if (name === 'phone') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, phone: '' });
    } else if (name === 'website') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
      setErrors({ ...errors, website: '' });
    } else if (name === 'whitePaper') {
      setPoolMeta({ ...poolMeta, [name]: e.target.value });
    } else if (name === 'identityDoc') {
      setDocIdentity(true);
      const file = e.target.files[0];
      setIdentityDocError('');
      if (checkMimeType(e)) {
        const identityDocUrl = await client.add(file);
        const docUrl = `${identityDocUrl.path}`;
        setPoolMeta({ ...poolMeta, [name]: docUrl });
        setTimeout(() => setDocIdentity(false), 3000);
      } else {
        Swal.fire('Failed! Please select correct Image Format', 'Supported files ["png", "jpg", "jpeg", "gif"]', 'error');
      }
    } else if (name === 'poolingToken') {
      setPoolMeta({ ...poolMeta, [name]: value });
      // if (ethers.utils.isAddress(value) && value != '' && value != null) {
      const contract = await FetchProvider(value, TokenAbi);
      setPoolName('');
      if (contract !== undefined) {
        setErrors({ ...errors, poolingToken: '' });
        setPoolName('loading');
        contract
          .name()
          .then(res => {
            if (res !== bidName) {
              setPoolName(res);
              fetchBal(value); //setting balance of depositing token
              contract
                .totalSupply()
                .then(res => {
                  setPoolMeta({
                    ...poolMeta,
                    // totalSupply: res,
                    poolingToken: value,
                  });
                })
                .catch(err => {});
            } else {
              setErrors({
                ...errors,
                poolingToken: 'Both tokens address cannot be same',
              });
            }
          })
          .catch(err => {
            setPoolName('');
            if (poolMeta.network === 'Goerli Testnet') {
              setErrors({
                ...errors,
                poolingToken: 'Enter valid ERC20 token address',
              });
            } else {
              setErrors({
                ...errors,
                poolingToken: 'Enter BEP20 token address',
              });
            }
          });
      } else {
        setErrors({ ...errors, poolingToken: 'Enter Valid Address' });
      }
      // }
      // handleValidation()
    } else {
      setPoolMeta({ ...poolMeta, [name]: value });
    }
    // errorsRemoveHandler();
  };

  const checkMimeType = event => {
    //getting file object
    let file = event.target.files;
    //define message container
    let err = '';
    // list allow mime type
    const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

    // compare file type find doesn't matach
    if (types.every(type => file[0]?.type !== type)) {
      // create error message and assign to container
      err = file[0].type + ' is not a supported format';
    }

    if (err !== '') {
      // if message not same old that mean has error
      event.target.value = null; // discard selected file
      console.log(err);
      return false;
    }
    return true;
  };

  const handleValidation = async () => {
    setLogoError('');
    setIdentityDocError('');
    setNetworkError('');
    const {
      title,
      description,
      logo,
      network,
      poolSellAmount,
      minimumBuyAmount,
      minimumBiddingAmount,
      minimumFundingThreshold,
      poolingToken,
      biddingToken,
      isKyc,
      name,
      email,
      phone,
      identityDoc,
      website,
      telegram,
      podcast,
      medium,
      twitter,
    } = poolMeta;
    var newErrors = {};

    // regex to remove space at start
    const regexp = /^[^\s]/;
    const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const regexNumber = new RegExp(/"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"/gim);
    const regexName = function newFunctionStr2(str) {
      return (
        /^[A-Za-z\s]*$/.test(str) &&
        /[A-Za-z]/.test(str) &&
        // /\s/.test(str) &&
        /^[^\s]/.test(str)
      );
    };
    if (title === '' || !regexp.test(title)) {
      newErrors.title = 'Please enter title';
    }
    if (description === '') {
      newErrors.description = 'Please enter description';
      setDescripBool(true);
    }
    if (!regexp.test(description)) {
      newErrors.description = 'Space not allowed at start';
      setDescripBool(true);
    }
    if (logo === '' || null) {
      setLogoError('Please select logo');
    }
    if (poolSellAmount === 0 || poolSellAmount === null || poolSellAmount === '') {
      newErrors.poolSellAmount = 'Please define auction sell amount';
    }
    if (minimumBuyAmount === 0 || minimumBuyAmount === null || minimumBuyAmount === '') {
      newErrors.minimumBuyAmount = 'Please define minimum buy amount';
    }
    if (minimumBiddingAmount === 0 || minimumBiddingAmount === null || minimumBiddingAmount === '') {
      newErrors.minimumBiddingAmount = 'Please define minimum bidding amount';
    }
    if (minimumFundingThreshold === 0 || minimumFundingThreshold === null || minimumFundingThreshold === '') {
      newErrors.minimumFundingThreshold = 'Please define minimum funding threshold';
    }
    // for network validation
    if (network === '' || network === undefined || network === 'Select A Network') {
      setNetworkError('Please select a network');
    }

    if (poolingToken === '' || poolingToken === undefined || poolingToken === '') {
      newErrors.poolingToken = 'Please select pooling token';
    }
    if (biddingToken === '' || biddingToken === undefined || biddingToken === 'Select Bidding Token') {
      newErrors.biddingToken = 'Please select bidding token';
    }

  
    function converstionUTC(dt){
      const localTime = new Date(`${dt}`);
      const utcTime = new Date(localTime.getTime() + (localTime.getTimezoneOffset() * 60000));
      console.log("🚀 ~ file: createpool.js:538 ~ converstionUTC ~ utcTime:", utcTime)
      return utcTime;
    }
    var startDate = converstionUTC(sDate);
    const sDate1 = startDate / 1000;
    setPoolMeta({ ...poolMeta, poolStartDate: sDate1 });
    var endDate = converstionUTC(eDate);
    const eDate1 = endDate / 1000;
    setPoolMeta({ ...poolMeta, poolEndDate: eDate1 });
    var cancelDate = converstionUTC(cDate);
    const cDate1 = cancelDate / 1000;
    setPoolMeta({ ...poolMeta, poolCancelDate: cDate1 });
    // let currentData = moment(Date.now()).unix();
    const now = new Date();
    const localTimeSeconds = Math.floor(now.getTime() / 1000);
    const utcOffsetSeconds = now.getTimezoneOffset() * 60;
    console.log("🚀 ~ file: createpool.js:554 ~ handleValidation ~ utcOffsetSeconds:", utcOffsetSeconds)
    const utcTimeSeconds = localTimeSeconds + utcOffsetSeconds;
    let currentData = utcTimeSeconds;
    console.log("🚀 ~ file: createpool.js:557 ~ handleValidation ~ currentData:", currentData)
    // let currentData = Math.floor(Date.now() / 1000)

    if (sDate1 <= 0 || sDate1 < currentData || sDate1 > eDate1) {
      newErrors.poolStartDate = 'Start date should greater than current time and less than end date';
    }

    if (eDate1 <= 0 || eDate1 < sDate1 || eDate1 <= cDate1) {
      newErrors.poolEndDate = ' Pool end date should greater than start date and current time';
    }

    if (cDate1 <= sDate1 || cDate1 >= eDate1) {
      newErrors.poolCancelDate = ' Pool cancellation date should greater than start date and less than end date';
    }


    if (!ethers.utils.isAddress(poolingToken)) {
      newErrors.poolingToken = ' Enter valid pooling token address';
    }

    if (parseInt(poolBalance) < parseInt(poolSellAmount)) {
      newErrors.poolSellAmount = " You don't have Enough Balance to Deposit in For IDO";
    }

    if (name === '') {
      newErrors.name = 'Please enter your name';
    }
    if (!regexp.test(name)) {
      newErrors.name = 'Space not allowed at start';
    }
    if (email === '') {
      newErrors.email = 'Please enter your email';
    }
    if (!regexEmail.test(email)) {
      newErrors.email = 'please enter valid email';
    }
    if (phone === '') {
      newErrors.phone = 'Please enter your phone';
    }
    if (identityDoc === '' || null) {
      setIdentityDocError('Please select identity document');
    }
    if (phone === '' || null) {
      newErrors.phone = 'Please enter your phone';
    }
    // if(!regexNumber.test(phone)){
    //   newErrors.phone = 'Please enter valid phone';
    // }

    const regex = new RegExp('https?://(www.)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
    if (website && !regex.test(website)) {
      newErrors.website = 'Enter valid website link';
    }
    if (website == '' || website === undefined) {
      newErrors.website = 'Atleast website link is required';
    }
    if (telegram && !regex.test(telegram)) {
      newErrors.telegram = 'Enter valid telegram link';
    }

    if (twitter && !regex.test(twitter)) {
      newErrors.twitter = 'Enter valid twitter link';
    }

    if (medium && !regex.test(medium)) {
      newErrors.medium = 'Enter valid medium link';
    }

    if (podcast && !regex.test(podcast)) {
      newErrors.podcast = 'Enter valid podcast link';
    }

    if (
      networkError !== '' ||
      logoError !== '' ||
      identityDocError !== '' ||
      Object.keys(newErrors)?.length > 0 ||
      poolName === '' ||
      poolName === 'loading' ||
      bidName === '' ||
      bidName === 'loading'
    ) {
      setErrors(newErrors);
      setModalShow(false);
      return false;
    } else {
      // setBtnActive(true)
      setErrors({});
      // setApPool(false);
      return true;
    }
  };

  const uploadToIPFS = async data => {
    const res = await client.add(JSON.stringify(data));
    return res.path;
  };

  const FetchProvider = async (tokenAdd, Abi) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum || process.env.REACT_APP_TESTNET_RPC_URL);
    const signer = provider.getSigner();
    if (ethers.utils.isAddress(tokenAdd)) {
      var address = tokenAdd;
      var contract = new ethers.Contract(address, Abi, signer);
      return contract;
    }
  };

  const contractHandler = (Abi, tokenAdd) => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(Abi, tokenAdd);
    return contract;
  };

  const fetchBal = async addresss => {
    let TokenData = {};
    const contract = await FetchProvider(addresss, TokenAbi);
    const Decimals = parseInt(await contract.decimals());
    const symbol = await contract.symbol();
    const name = await contract.name();
    const count = parseInt(await contract.balanceOf(address?.toLocaleLowerCase()));
    const balInDecimals = (count / Math.pow(10, Decimals)).toFixed(3);
    setPoolBalance(balInDecimals);
    TokenData.decimals = Decimals;
    TokenData.symbol = symbol;
    TokenData.name = name;
    return TokenData;
  };

  const getDecimalss = async address => {
    const contract = await FetchProvider(address, TokenAbi);
    const Decimals = parseInt(await contract.decimals());
    return Decimals;
  };

  const networkCheck = () => {
    if (poolMeta?.network === platformSupportedChains[chain.id]?.name) return true;
  };

  const IDOSale = async () => {
    const validate = await handleValidation();

    if (validate) {
      if (networkCheck()) {
        setModalShow(true);
        var poolingTokenInfo = await fetchBal(poolMeta.poolingToken);
        var biddingTokensInfo = await fetchBal(selectedBiddingToken);
        const web3 = new Web3(window.ethereum);
        const chainContract = platformSupportedChains[chain.id];
        const mutoPool = contractHandler(ContractAbi, chainContract.poolContract);
        const btTokenContract = new web3.eth.Contract(TokenAbi, selectedBiddingToken);
        const bdDec = await getDecimalss(selectedBiddingToken);
        const ptDec = await getDecimalss(poolMeta.poolingToken);
        const ptTokenContract = new web3.eth.Contract(TokenAbi, poolMeta.poolingToken);
        try {
          const { hash, ...rest } = poolMeta;
          let pathHash = await uploadToIPFS({ ...rest, biddingToken: selectedBiddingToken });
          let sellAmt = web3.utils.toWei(poolMeta?.poolSellAmount, 'ether');
          let minBuyAmt = web3.utils.toWei(poolMeta.minimumBuyAmount, 'ether');
          let minBidAmt = web3.utils.toWei(poolMeta.minimumBiddingAmount, 'ether');
          let minFundingTrd = web3.utils.toWei(poolMeta.minimumFundingThreshold, 'ether');
          const balanceCheck = await ptTokenContract.methods.balanceOf(address?.toLocaleLowerCase()).call();
          const ptDecimals = await ptTokenContract.methods.decimals().call();
          const btDecimals = await btTokenContract.methods.decimals().call();
          console.log(`data`, poolMeta)
          const data = [
            pathHash,
            poolMeta.poolingToken,
            selectedBiddingToken,
            poolMeta.poolCancelDate,
            poolMeta.poolStartDate,
            poolMeta.poolEndDate,
            sellAmt,
            minBuyAmt,
            minBidAmt,
            minFundingTrd,
            poolMeta.isFinalize,
            [toWeiValue(1, ptDecimals), toWeiValue(1, btDecimals)],
          ];
          console.log(`data--`, data)
          if (poolBalance >= parseInt(poolMeta?.poolSellAmount)) {
            let allowanceCheck = 0;
            allowanceCheck = await ptTokenContract.methods.allowance(acc, chainContract.poolContract).call();
            let result;
            if (parseInt(allowanceCheck) <= parseInt(poolMeta?.poolSellAmount)) {
              try {
                result = await ptTokenContract.methods
                  .approve(chainContract.poolContract, '115792089237316195423570985008687907853269984665640564039457584007913129639935')
                  .send({ from: window.ethereum.selectedAddress });
              } catch (e) {
                setModalShow(false);
                Swal.fire('Transaction Failed!', 'Pool Creation Not Successful', 'error');
              }
            }
            if (parseInt(allowanceCheck) >= parseInt(poolMeta?.poolSellAmount) || result.blockHash) {
              setApTok1(true);
              try {
                let res = await mutoPool.methods.initiatePool(data).send({ from: window.ethereum.selectedAddress });
                localStorage.setItem('poolCreateTrx', true);
                if (res.blockHash) {
                  const txHash = res.transactionHash;
                  const plId = res.events.NewPoolE1.returnValues.poolId;
                  setPoolId(plId);
                  const poolData = Object.assign({}, poolMeta);
                  poolData.hash = pathHash;
                  poolData.transactionHash = txHash;
                  poolData.poolId = plId;
                  poolData.poolOwner = acc;
                  poolData.biddingToken = selectedBiddingToken;
                  poolData.ptName = poolingTokenInfo.name;
                  poolData.ptSymbol = poolingTokenInfo.symbol;
                  poolData.ptDecimals = poolingTokenInfo.decimals;
                  poolData.bdName = biddingTokensInfo.name;
                  poolData.bdSymbol = biddingTokensInfo.symbol;
                  poolData.bdDecimals = biddingTokensInfo.decimals;
                  const resData = dispatch(createPool(poolData));
                  if (resData) {
                    setApTok2(true);
                    setPoolMeta({
                      title: '',
                      description: '',
                      network: 'Select A Network',
                      // -----------------To generate hash
                      poolingToken: '',
                      biddingToken: 'Select Bidding Token',
                      logo: '',
                      // ----------- Dates ---------
                      poolStartDate: new Date(),
                      poolEndDate: new Date(),
                      poolCancelDate: new Date(),
                      //
                      hash: '',
                      poolSellAmount: 0,
                      minimumBuyAmount: 0,
                      minimumBiddingAmount: 0,
                      minimumFundingThreshold: 0,
                      isKyc: true,
                      isFinalize: false,
                      // Proof of Identity
                      name: '',
                      email: '',
                      phone: '',
                      message: '',
                      identityDoc: '',
                      // ------- Socials -------
                      website: '',
                      telegram: '',
                      podcast: '',
                      medium: '',
                      twitter: '',
                      whitePaper: '',
                    });
                    setModalSuccess(true);
                    setIsCreated(true);
                  } else {
                    console.log('Some Error Occurred While Storing Data to DB');
                  }
                }
              } catch (e) {
                Swal.fire('Transaction Failed! ', 'Please try again gain later', 'error');
                setModalShow(false);
              }
            }
          } else {
            Swal.fire('❕ Insufficient Tokens', 'Please deposit tokens and try again', 'error');
            setModalShow(false);
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            text: 'Some Error occurred, please try again later',
          });
          // AlertNotify('ℹ Some Error occurred, please try again later', 5000000);
          console.log(error);
        }
      } else {
        Swal.fire({
          title: 'wrong network',
          icon: 'error',
          text: 'selected and wallet networks are different',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Please fill the form complete and correctly',
      });
      // AlertNotify('ℹ Please fill the form complete and correctly.', 20000);
      setModalShow(false);
    }
    // debugger
  };

  const handleImgError = ev => {};

  document.addEventListener('wheel', () => {
    if (document.activeElement.type === 'number') {
      document.activeElement.blur();
    }
  });

  return (
    <>
      <div className='mutopad-w-100'>
        <div className='content'>
          <Card className='pt-lg-4 pt-3 h-auto' id='style-6'>
            <Card.Header className='titles-sett'>
              <h2 className='text-shadow'>Create Pool</h2>
            </Card.Header>
            <Card.Body>
              <div className='container'>
                <div className='heading'>
                  <h3 className='text-white  mt-4'>Information</h3>
                </div>
                <hr className='text-white'></hr>
                {/* <Form className='create-pool text-white' onKeyUp={handleValidation} >
                 */}
                <Form className='create-pool text-white'>
                  <Row className='align-items-center'>
                    <div className='col-md-6 mb-md-0 mb-3'>
                      <Form.Group className='mb-md-4 mb-4 input_error' controlId='title'>
                        <Info name={'Title'} desc={'Title Should be in String and max 50 letter'} />
                        <Form.Control type='text' ref={myRef} placeholder='Enter Title of Token' value={poolMeta.title} name='title' onChange={handleChange} isInvalid={!!errors.title} />
                        <ErrorLabels props={errors.title} />
                      </Form.Group>
                    </div>
                    <div className='col-md-6 mb-3'>
                      <div className='cross-icon-wrapper'>
                        {poolMeta.logo !== '' ? (
                          <span className='cross-icon' onClick={handleLogoChange}>
                            x
                          </span>
                        ) : (
                          <></>
                        )}
                        <div className='img-cover-box'>
                          {poolMeta?.logo === '' || poolMeta?.logo === undefined ? (
                            <>
                              <Form.Label htmlFor='fileUpload'>
                                <p className='logo_text mb-0 w-75'>
                                  <figure className='mx-auto upload-img'>
                                    <img src={uploadImg} className='img-fluid' alt='Upload'></img>
                                  </figure>
                                  <span>
                                    Drop your image here, or <span className='text-shadow fw-bold'>Browse</span>
                                  </span>
                                </p>
                              </Form.Label>
                              <Form.Control className='upload_logo h-100 w-100 p-0' name='logo' accept='image/*' placeholder='Upload Logo' type='file' onChange={handleChange} />
                              <span className='text-danger'>{logoError ? logoError : ''}</span>
                            </>
                          ) : (
                            <>
                              {poolMeta?.logo !== undefined && poolMeta?.logo !== '' && docLoading === false ? (
                                <>
                                  <Form.Control
                                    className='upload_logo h-100 w-100 p-0'
                                    name='logo'
                                    placeholder='Upload Logo'
                                    type='file'
                                    onChange={() => {
                                      handleChange(), setDocLoading(true);
                                    }}
                                  />
                                  <img src={`https://ipfs.io/ipfs/${poolMeta.logo}`} alt='logo' className='img-fluid' width='100' height='100' onError={handleImgError}></img>
                                </>
                              ) : (
                                <>
                                  <div className='text-center faq-loader'>
                                    <TailSpin height='30' width='30' color='#46bdf4' ariaLabel='loading' />
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-12 mb-md-0 mb-3'>
                      <Form.Group className='mb-md-5 mb-4 cms-pages-style' controlId='description'>
                        <Info name={'Description'} desc={'Description should be general and brief'} />
                        <CKEditor
                          editor={ClassicEditor}
                          name='description'
                          data={poolMeta.description == null ? '' : poolMeta.description}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setPoolMeta({ ...poolMeta, description: data });
                            setDescripBool(false);
                          }}
                        />
                        {/* <Form.Control as='textarea' rows={3} name='description' value={poolMeta.description} placeholder='Enter Description' onChange={handleChange} isInvalid={!!errors.description} /> */}
                        <ErrorLabels props={errors.description} />
                        <span style={{ color: '#dc3545' }}>{errors?.description !== '' && descripBool === true ? errors?.description : ''}</span>
                      </Form.Group>
                    </div>
                  </Row>
                  {/* Chain Information */}
                  <div className='heading'>
                    <h3 className='text-white mt-4'>Chain Information</h3>
                  </div>
                  <hr className='text-white mb-md-5 mb-3'></hr>
                  <Row>
                    <div className='col-md-6 mb-md-0 mb-3'>
                      <Form.Group className='mb-md-5 mb-4' controlId='poolStartDat1e'>
                        <Info name={'Network'} desc={'Select Network e.g Bsc,Eth'} />
                        <Dropdown style={{ backgroundColor: '#050d5982' }}>
                          <Dropdown.Toggle
                            className='p-lg-4 p-3 primary_dropdown'
                            id='dropdown-basic'
                            style={{
                              backgroundColor: '#050d5982',
                              width: '100%',
                            }}
                          >
                            {poolMeta.network}
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            style={{
                              width: '100%',
                              backgroundColor: '#1F1D3D',
                            }}
                            name='network'
                          >
                            {network.map((item, index) => {
                              return (
                                <Dropdown.Item
                                  className='text-white network-drop'
                                  value={item}
                                  key={index}
                                  onClick={() => {
                                    handleNetwork(item);
                                  }}
                                  name='biddingToken'
                                  isInvalid={!!errors.biddingToken}
                                >
                                  {item}
                                </Dropdown.Item>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                        <span className='text-danger'>{networkError ? networkError : ''}</span>
                      </Form.Group>
                      <Form.Group className='mb-md-5 mb-4' controlId='poolingToken'>
                        <Info name={'Pooling Token'} desc={'Enter Address of pooling token in hex form e.g 0x....'} />
                        {poolName === '' ? (
                          <></>
                        ) : poolName === 'loading' ? (
                          <p className='text-white text-end float-end'>
                            <img src='https://i.stack.imgur.com/qq8AE.gif' alt='loader' style={{ width: '15%' }} />
                          </p>
                        ) : (
                          <p className='text-white text-end float-end'>{poolName}</p>
                        )}

                        <Form.Control
                          type='text'
                          value={poolMeta.poolingToken}
                          onChange={handleChange}
                          name='poolingToken'
                          isInvalid={!!errors.poolingToken}
                          placeholder='Paste pooling token address'
                        />
                        <ErrorLabels props={errors.poolingToken} />
                      </Form.Group>
                    </div>
                    <div className='col-md-6 mb-md-5 mb-4'>
                      <div className='d-flex flex-column justify-content-end h-100'>
                        <Form.Group className='input_error' controlId='biddingToken'>
                          <Info name={'Bidding Token'} desc={'Select Bidding Token'} />
                          <Dropdown style={{ backgroundColor: '#050d5982' }}>
                            <Dropdown.Toggle
                              className='p-lg-4 p-3 primary_dropdown'
                              id='dropdown-basic'
                              style={{
                                backgroundColor: '#050d5982',
                                width: '100%',
                              }}
                            >
                              {poolMeta.biddingToken}
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              style={{
                                width: '100%',
                                backgroundColor: '#1F1D3D',
                              }}
                              name='biddingToken'
                              isinvalid={!!errors.biddingToken}
                            >
                              {biddingToken.map((item, index) => {
                                return (
                                  <Dropdown.Item
                                    className='text-white network-drop'
                                    value={item?.name}
                                    key={index}
                                    onClick={() => {
                                      handleBiddingToken(item);
                                    }}
                                  >
                                    {item?.name}
                                  </Dropdown.Item>
                                );
                              })}
                            </Dropdown.Menu>
                          </Dropdown>
                        </Form.Group>
                        <span className='text-danger'>{errors?.biddingToken ? errors?.biddingToken : ''}</span>
                      </div>
                    </div>
                  </Row>

                  {/*-------------------- Tokennomics------------- */}
                  <div className='heading'>
                    <h3 className='text-white  mt-4'>Tokenomics</h3>
                  </div>
                  <hr className='text-white mb-5'></hr>
                  <Row>
                    <div className='col-md-6'>
                      <Form.Group className='mb-md-5 mb-4 cms-pages-style' controlId='poolSellAmount'>
                        <Info
                          name={'Amount of pool tokens to sell '}
                          desc={'Enter the amount of pooling tokens to sell in this pool. You must hold the balance of the tokens before creating this pool.'}
                        />
                        <Form.Control
                          type='number'
                          name='poolSellAmount'
                          value={poolMeta.poolSellAmount}
                          placeholder='Enter auction sell amount'
                          onChange={handleChange}
                          isInvalid={!!errors.poolSellAmount}
                        />
                        <p className='text-secondary mt-1 mb-0'>
                          Current Balance :{poolBalance} {poolName}
                        </p>
                        <ErrorLabels props={errors.poolSellAmount} />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>&nbsp;</div>
                    <div className='col-md-6'>
                      <Form.Group className='mb-md-5 mb-4 cms-pages-style' controlId='minimumBuyAmount'>
                        <Info
                          name={'Minimum amount of pool tokens to buy'}
                          desc={'Minimum amount of tokens that must be equal or greater to place an order in the pool. User cannot buy pool tokens less then this amount.'}
                        />
                        <Form.Control
                          type='number'
                          name='minimumBuyAmount'
                          value={poolMeta.minimumBuyAmount}
                          placeholder='Enter minimum buy amount'
                          onChange={handleChange}
                          isInvalid={!!errors.minimumBuyAmount}
                        />
                        <ErrorLabels props={errors.minimumBuyAmount} />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group className='mb-md-5 mb-4 cms-pages-style' controlId='minimumBiddingAmount'>
                        <Info
                          name={'Minimum bidding amount to buy'}
                          desc={'Minimum amount of bidding tokens that are used to place the order in the pool. User cannot place order less then this value'}
                        />
                        <Form.Control
                          type='number'
                          name='minimumBiddingAmount'
                          value={poolMeta.minimumBiddingAmount}
                          placeholder='Enter minimum bidding amount'
                          onChange={handleChange}
                          isInvalid={!!errors.minimumBiddingAmount}
                        />
                        <ErrorLabels props={errors.minimumBiddingAmount} />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group className='mb-md-5 mb-4 cms-pages-style' controlId='minimumFundingThreshold'>
                        <Info
                          name={'Target amount of bidding and invest on given tokens'}
                          desc={
                            'Total amount of bidding tokens that are required must to make the pool success and finilized, otherwise pool will be failed if did not reach the amount of bidding and the token will be refunded after end time of the pool'
                          }
                        />
                        <Form.Control
                          type='number'
                          name='minimumFundingThreshold'
                          value={poolMeta.minimumFundingThreshold}
                          placeholder='Enter minimum funding threshold'
                          onChange={handleChange}
                          isInvalid={!!errors.minimumFundingThreshold}
                        />
                        <ErrorLabels props={errors.minimumFundingThreshold} />
                      </Form.Group>
                    </div>
                  </Row>
                  {/*-------------------------White List -----------*/}
                  <div className='heading'>
                    <h3 className='text-white  mt-4'>Pool Listing Type</h3>
                    {/* <small> Note: By Default its Public</small> */}
                    <hr className='text-white mb-5'></hr>
                  </div>
                  <Row>
                    <Info name={`Note: By Default its Public`} desc={'Enter Date When IDO Will Open'} />
                    <div className='col-md-6 mb-md-0 mb-3 d-flex justify-content-between'>
                      <Form.Group className='mb-md-5 mb-4 d-flex flex-column' controlId='poolStartDate11'>
                        <div className='radio'>
                          <label>
                            <input
                              type='radio'
                              value='public'
                              checked={poolMeta.poolType === 'public'}
                              onChange={e => {
                                setPoolMeta({ ...poolMeta, poolType: e.target.value });
                              }}
                            />
                            <b> Public </b>
                          </label>
                        </div>
                      </Form.Group>
                      <Form.Group className='mb-md-5 mb-4 d-flex flex-column' controlId='poolStartDate11'>
                        <div className='radio'>
                          <label>
                            <input
                              type='radio'
                              value='whiteList'
                              checked={poolMeta.poolType === 'whiteList'}
                              onChange={e => {
                                setPoolMeta({ ...poolMeta, poolType: e.target.value });
                              }}
                            />
                            <b> WhiteList </b>
                          </label>
                        </div>
                      </Form.Group>
                    </div>
                  </Row>
                  {/*-------------- Date--------------- */}
                  <div className='heading'>
                    <h3 className='text-white  mt-4'>Date</h3>
                    <p>
                      <small style={{color:"yellow"}}> Note: please select according to UTC standards.</small>
                    </p>
                  </div>
                  <hr className='text-white mb-5'></hr>
                  <Row>
                    <div className='col-md-6 mb-md-0 mb-3'>
                      <Form.Group className='mb-md-5 mb-4 d-flex flex-column' controlId='poolStartDate11'>
                        <Info name={'Presale Listing Date (UTC)'} desc={'Enter Date When IDO Will Open'} />
                        <Flatpickr
                          data-enable-time
                          options={{
                            dateFormat: "Y-m-d H:i\\",
                            time_24hr: true,
                            utc: true,
                          }}
                          value={sDate}
                          placeholder="Enter Start Date"
                          onChange={e => {
                            handleStartDate(e);
                          }}
                          isInvalid={!!errors.poolStartDate}
                        />
                        {errors.poolStartDate !== '' ? <span className='text-danger'>{errors.poolStartDate}</span> : <></>}
                      </Form.Group>
                    </div>
                    <div className='col-md-6 mb-md-0 mb-3'>
                      <Form.Group className='mb-md-5 mb-4 d-flex flex-column' controlId='poolEndDate'>
                        <Info name={'Presale End Date (UTC)'} desc={'Enter Date When IDO Will End'} />
                        <Flatpickr
                          data-enable-time
                          options={{
                            dateFormat: "Y-m-d H:i\\",
                            time_24hr: true,
                            utc: true,
                          }}
                          name='poolEndDate'
                          value={eDate}
                          placeholder="Enter End Date"

                          isInvalid={!!errors.poolEndDate}
                          onChange={e => {
                            handleEndDate(e);
                          }}
                        />
                        {errors.poolEndDate !== '' ? <span className='text-danger'>{errors.poolEndDate}</span> : <></>}
                      </Form.Group>
                    </div>
                    <div className='col-md-6 mb-md-0 mb-3'>
                      <Form.Group className='mb-md-5 mb-4 d-flex flex-column' controlId='cancellationDate'>
                        <Info name={'Presale Cancellation Date (UTC)'} desc={'Enter Date When IDO Will Cancel'} />
                        <Flatpickr
                          data-enable-time
                          name='cancellationDate'
                          options={{
                            dateFormat: "Y-m-d H:i\\",
                            time_24hr: true,
                            utc: true,
                          }}
                          placeholder="Enter Cancel Date"
                          value={cDate}
                          isInvalid={!!errors.poolCancelDate}
                          onChange={e => {
                            handleCancelDate(e);
                          }}
                        />
                        {errors.poolCancelDate !== '' ? <span className='text-danger'>{errors.poolCancelDate}</span> : <></>}
                      </Form.Group>
                    </div>
                    <div className='col-md-6 mb-md-0 mb-3'></div>
                  </Row>

                  {/*------------- Proof of Identity----------------- */}
                  <div className='proof-of-identity'>
                    <div className='heading'>
                      <h3 className='text-white mt-4'>Proof of Identity</h3>
                    </div>
                    <hr className='text-white mb-5'></hr>
                    <Row>
                      <div className='col-md-6 mb-md-0 mb-3'>
                        <Form.Group className='mb-md-5 mb-4' controlId='name'>
                          <Info name={'Name'} desc={'Enter your Name'} />
                          <Form.Control type='text' value={poolMeta.name} onChange={handleChange} name='name' placeholder='Enter your full name' isInvalid={!!errors.name} />
                          <ErrorLabels props={errors.name} />
                        </Form.Group>
                        <Form.Group className='mb-md-5 mb-4' controlId='email'>
                          <Info name={'Email'} desc={'Enter your Email'} />
                          <Form.Control type='email' value={poolMeta.email} onChange={handleChange} name='email' placeholder='Enter your email' isInvalid={!!errors.email} />
                          <ErrorLabels props={errors.email} />
                        </Form.Group>
                        <Form.Group className='mb-md-5 mb-4' controlId='phone'>
                          <Info name={'Phone'} desc={'Enter your Phone Number'} />
                          <Form.Control type='number' value={poolMeta.phone} onChange={handleChange} name='phone' placeholder='Enter your phone number' isInvalid={!!errors.phone} />
                          <ErrorLabels props={errors.phone} />
                        </Form.Group>
                      </div>
                      <div className='col-md-6 mb-md-0 mb-3'>
                        <Form.Group className='mb-md-5 mb-4 cms-pages-style message-pool-input-wrapper' controlId='user-message'>
                          <Info name={'Message'} desc={'Enter your message'} />
                          <Form.Control as='textarea' rows={3} value={poolMeta.message} onChange={handleChange} name='message' placeholder='message' />
                        </Form.Group>
                        <Form.Group className='mb-md-5 mb-4' controlId='image'>
                          <div className='cross-icon-wrapper'>
                            <div className='img-cover-box'>
                              {poolMeta?.identityDoc === '' || poolMeta?.identityDoc === undefined ? (
                                <>
                                  <Form.Label>
                                    <p className='logo_text mb-0 w-75'>
                                      <figure className='mx-auto upload-img'>
                                        <img src={uploadImg} className='img-fluid' alt='identityDoc'></img>
                                      </figure>
                                      <span>
                                        Drop your identity doc here, or <span className='text-shadow fw-bold'>Browse</span>
                                      </span>
                                    </p>
                                  </Form.Label>
                                  <Form.Control className='upload_logo h-100 w-100 p-0' name='identityDoc' placeholder='Upload identity doc' type='file' onChange={handleChange} />
                                  <span className='text-danger'>{identityDocError ? identityDocError : ''}</span>
                                </>
                              ) : (
                                <>
                                  {poolMeta?.identityDoc !== undefined && poolMeta?.identityDoc !== '' && docIdentity === false ? (
                                    <>
                                      <span className='cross-icon' onClick={handleIdentityDocChange}>
                                        x
                                      </span>
                                      <img src={`https://ipfs.io/ipfs/${poolMeta.identityDoc}`} alt='identityDoc' className='img-fluid' width='100' height='100' onError={handleImgError}></img>
                                      <Form.Control className='upload_logo h-100 w-100 p-0' name='identityDoc' placeholder='Upload identity doc' type='file' onChange={handleChange} />
                                    </>
                                  ) : (
                                    <>
                                      <div className='text-center faq-loader'>
                                        <TailSpin height='30' width='30' color='#46bdf4' ariaLabel='loading' />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                    </Row>
                  </div>

                  {/*------------- Socials----------------- */}
                  <div className='heading'>
                    <h3 className='text-white  mt-4'>Other Details</h3>
                  </div>
                  <hr className='text-white mb-5'></hr>

                  <Row>
                    <div className='col-md-6 mb-md-0 mb-3'>
                      <Form.Group className='mb-md-5 mb-4' controlId='twitter'>
                        <Form.Label>Twitter</Form.Label>
                        <Info desc={'format: https://xyz.com'} />
                        <Form.Control type='url' value={poolMeta.twitter} onChange={handleChange} name='twitter' placeholder='e.g https://www.twitter.com' isInvalid={!!errors.twitter} />

                        <ErrorLabels props={errors.twitter} />
                      </Form.Group>

                      <Form.Group className='mb-md-5 mb-4' controlId='medium'>
                        <Form.Label>Medium</Form.Label>
                        <Info desc={'format: https://xyz.com'} />

                        <Form.Control type='url' value={poolMeta.medium} onChange={handleChange} name='medium' placeholder='e.g https://www.medium.com' isInvalid={!!errors.medium} />

                        <ErrorLabels props={errors.medium} />
                      </Form.Group>
                      <Form.Group className='mb-md-5 mb-4' controlId='formBasicEmail'>
                        <Form.Label>Website</Form.Label>
                        <Info desc={'format: https://xyz.com'} />
                        <Form.Control type='url' value={poolMeta.website} onChange={handleChange} name='website' placeholder='e.g https://www.mutopad.com' isInvalid={!!errors.website} required />
                        <ErrorLabels props={errors.website} />
                      </Form.Group>
                    </div>
                    <div className='col-md-6 mb-md-0 mb-3'>
                      <Form.Group className='mb-md-5 mb-4' controlId='formBasicEmail'>
                        <Form.Label>Podcast</Form.Label>
                        <Info desc={'format: https://xyz.com'} />

                        <Form.Control type='url' value={poolMeta.podcast} onChange={handleChange} name='podcast' placeholder='e.g https://www.podcast.com' isInvalid={!!errors.podcast} />

                        <ErrorLabels props={errors.podcast} />
                      </Form.Group>
                      <Form.Group className='mb-md-5 mb-4' controlId='formBasicEmail'>
                        <Form.Label>Telegram</Form.Label>
                        <Info desc={'format: https://xyz.com'} />

                        <Form.Control type='url' value={poolMeta.telegram} onChange={handleChange} name='telegram' placeholder='e.g https://www.telegram.com' isInvalid={!!errors.telegram} />

                        <ErrorLabels props={errors.telegram} />
                      </Form.Group>
                      <Form.Group className='mb-md-5 mb-4' controlId='formBasicEmail'>
                        <Form.Label>WhitePaper</Form.Label>
                        <Info desc={'format: https://whitedoc@wasim.com'} />
                        <Form.Control type='url' value={poolMeta.whitePaper} onChange={handleChange} name='whitePaper' placeholder='e.g https://whitedoc@wasim.com' isInvalid={!!errors.whitePaper} />
                        <ErrorLabels props={errors.whitePaper} />
                      </Form.Group>
                    </div>
                  </Row>

                  {/*------------ tokennomics---------- */}
                  <div className='btn-wrapper border-0'>
                    <Button className='light-blue-btn w-10' onClick={IDOSale}>
                      Create Pool
                    </Button>
                  </div>
                </Form>
              </div>
              {alert !== '' ? <Alerts message={alert} show={true} /> : <></>}
              {modalShow ? (
                <Modal
                  className='pool-modal auction-modal'
                  show={modalShow}
                  backdrop='static'
                  keyboard={false}
                  onHide={() => setModalShow(false)}
                  // size="md"
                  centered
                >
                  <Modal.Header>
                    <Modal.Title id='contained-modal-title-vcenter'>Create Auction</Modal.Title>
                  </Modal.Header>

                  {/* {alert !== '' ? <Alerts message={alert} show={true} /> : <></>} */}
                  <Modal.Body>
                    {modalSuccess === true ? (
                      <>
                        {isCreated === true ? (
                          <div className='text-center modal-success-status'>
                            <div>
                              <FontAwesomeIcon icon={faCheckCircle} />
                            </div>
                            <div>Pool Added Successfully</div>
                            <div>
                              <p style={{ color: 'yellow' }}>Note: Pool will not be live unless KYC approves by the admin</p>
                            </div>
                            <div>
                              {/* check idoTokenAdd */}
                              <Link to={`/pool/${encode(poolId)}`}>Direct To Pool Details</Link>
                            </div>
                          </div>
                        ) : (
                          <> </>
                        )}
                      </>
                    ) : (
                      <Accordion>
                        <Accordion.Item eventKey='0'>
                          <Accordion.Header>
                            <div className={apTok1 ? 'icon' : 'icon pending'}>
                              <FontAwesomeIcon icon={apTok1 ? faCheck : faExclamation} />
                              {apTok1 ? (
                                ''
                              ) : (
                                <div className='loader'>
                                  <div className='lds-ring'>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {bidBalErr === '' ? <>Approve "{poolName}" Token</> : <p className='text-danger p-2'>{bidBalErr}</p>}
                          </Accordion.Header>
                        </Accordion.Item>
                        <Accordion.Item eventKey='1'>
                          <Accordion.Header>
                            <div className={apTok2 ? 'icon' : 'icon pending'}>
                              <FontAwesomeIcon icon={apTok2 ? faCheck : faExclamation} />
                              {apTok2 ? (
                                ''
                              ) : (
                                <div className='loader'>
                                  <div className='lds-ring'>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {poolBalErr === '' ? <>{'Create Pool'}</> : <p className='text-danger p-2'>{poolBalErr}</p>}
                          </Accordion.Header>
                        </Accordion.Item>
                      </Accordion>
                    )}
                  </Modal.Body>
                  <Modal.Footer className='text-center'>
                    {isCreated === true ? (
                      <Button
                        className='blue-imp light-blue-btn'
                        onClick={() => {
                          setModalShow(false);
                          navigate('/admin/managepools');
                        }}
                      >
                        Done
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Modal.Footer>
                </Modal>
              ) : (
                ''
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Createpool;