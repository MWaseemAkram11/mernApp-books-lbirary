import React, { useState } from 'react';
import network from '../../utils/network';
import Swal from 'sweetalert2';

const AddBooks = () => {
    const [image, setImage] = useState('');
    const [formData, setformData] = {
        bookName:'', authorName:'', description:''
    };
    const [errors, setErrors] = useState('');
    const [imagLoader, setImgLoader] = useState(null);

    const handleUpload = (e)=> {
        if (checkMimeType(e)) {
            const imgFile = e.target.files[0];
            const dataForm = new FormData();
            console.log(`image file---`, imgFile)
            dataForm.append('file',imgFile);
            dataForm.append('upload_preset', 'grocery-store');
            dataForm.append('cloud_name', 'dudvx0nrn');
            console.log(`-dataform--`,dataForm)
            fetch("https://api.cloudinary.com/v1_1/dudvx0nrn/image/upload",{
              method:"post",
              body:dataForm
            }).then(res=>res.json())
              .then(data=>
              // console.log(data.url)
              setImage(data)
            )
          } else {
            Swal.fire('Failed! Please select correct Image Format', 'Supported files ["png", "jpg", "jpeg", "gif"]', 'error');
          }
    }

    const checkMimeType = event => {
    let file = event.target.files;
    let err = '';
    const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    if (types.every(type => file[0]?.type !== type)) {
        err = file[0].type + ' is not a supported format';
    }
    if (err !== '') {
        event.target.value = null; // discard selected file
        console.log(err);
        return false;
    }
    return true;
    };

    const handleChange = async (e) => {
        const {name,value} = e.target;
        if(name === bookName){
            setformData({...formData, bookName:e.target.value});
            setErrors({...errors, bookName:''});
        } else if(name === authorName){
            setformData({...formData, authorName:e.target.value});
            setErrors({...errors, authorName:''});
        } else if(name === description){
            setformData({...formData, description:e.target.value});
            setErrors({...errors, description:''});
        } 
    }

    const handleValidation = async()=>{
        const {bookName, authorName, description} = formData;
        var newErrors = {};
        if(bookName === ''){
            newErrors.bookName = 'please enter book name';
        }
        if(authorName === ''){
            newErrors.authorName = 'please enter author name';
        }
        if(description === ''){
            newErrors.description = 'please enter description';
        }
        if(image === ''){
            newErrors.bookImage = 'please upload image of book'
        }
        setErrors(newErrors);
    }

    var raw = JSON.stringify(formData);
    
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };

    const addBookData = async () =>{
        e.preventDefault();
        const validate = await handleValidation();
        if(validate){
            fetch(network.baseUrl + "/add", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              if (result.success == true) {
                Swal.fire(
                    'Good job!',
                    'Your has been added!',
                    'success'
                );
              }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
              console.log("error", error);
            });
        }
    }
  return (
    <div className="signup">
        <h2>Add-Books</h2>
        <form onSubmit={addBookData}>
            <div className='form-childs'>
                <span>Book Name:</span>
                <input
                type="text"
                placeholder="book name" name='bookName' onChange={handleChange}
                />
            </div>
            <div className='form-childs'>
                <span>Author Name:</span>
                <input
                type="input"
                placeholder="author name" name="authorName" onChange={handleChange}
                />
            </div>
            <div className='form-childs'>
                <span>
                    Upload Book Image:
                </span>
                <input type='file' onChange={(e)=>{
                    handleUpload(e);
                    setImgLoader(true);
                    setInterval(() => setImgLoader(false),5000);
                }}/>
                {
                    image && imgLoader === false ?
                    <div style={{heigh:'200px',width:'350px',border:'2px solid black'}}>
                        <img src={image} />
                    </div>
                    :
                    <></>
                }
                
            </div>
            <div className='form-childs'>
                <span>Description</span>
                <textarea style={{resize:"none", height:"100px", width:"300px"}} name='description' placeholder='description here' onChange={handleChange}/>
            </div>
            <div className='form-childs'>
                <button className='btn' type="button"  >
                    Add Book
                </button>
            </div>
        </form>
    </div>
  )
}

export default AddBooks