import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Spinner, useToast } from '@chakra-ui/react'

const SingleListItem = () => {
  const [listing, setListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()
  const toast = useToast()
  
  useEffect(()=>{
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.singleListItemId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists){
        setListing(docSnap.data)
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.singleListItemId])
  
  return ( 
    <div>SingleListItem</div>
    
  )
}

export default SingleListItem