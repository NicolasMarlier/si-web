import { useCallback, useContext, useEffect, useState } from 'react'
import './SearchOverlay.scss'
import Downshift from 'downshift'
import { AppContext } from './AppProvider'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'

const SearchOverlay = () => {
    const { hints, invaders } = useContext(AppContext)

    const [items, setItems] = useState([] as Searchable[])
    const [showModal, setShowModal] = useState(false)

    const navigate = useNavigate();

    const keyDownListener = useCallback((e: KeyboardEvent) => {
        if(e.target && (e.target as any).tagName !== "INPUT") {
            console.log(e)
            if(e.code === 'KeyF') {
                setShowModal(true)
                e.stopPropagation()
                e.preventDefault()
            }
            if(e.code === 'Escape') {
                setShowModal(false)
                e.stopPropagation()
                e.preventDefault()
            }
        }
        if(e.target) {
            if(e.code === 'Escape') {
                setShowModal(false)
                e.stopPropagation()
                e.preventDefault()
            }
        }
    }, [])
    useEffect(
        () => {
          window.addEventListener('keydown', keyDownListener);
    
          return () => {
            window.removeEventListener('keydown', keyDownListener);
          };
        },
        []
    );

    useEffect(() => {
        setItems([
            ...invaders.map(invader => ({kind: 'invader', value: invader})),
            ...hints.map(hint => ({kind: 'hint', value: hint}))
        ])
    }, [hints, invaders])

    const itemDetails = ({kind, value}: Searchable) => {
        if(kind === 'invader') {
            return invaderDetails(value as Invader)
        }
        else if(kind === 'hint') {
            return hintDetails(value as Hint)
        }
        else {
            throw `Unsupported item kind: ${kind}`
        }
    }

    const invaderDetails = ({name, hosted_image_30_url}: Invader) => ({
        id: ['invader', name].join("|"),
        render: <div className="item">
            <img className="icon" src={hosted_image_30_url}/>
            {name}
        </div>,
        searchable: name,
        url: `/map/${name}`
    })

    const hintDetails = ({description, id}: Hint) => ({
        id: ['hint', (id || '?').toString()].join("|"),
        render: <div className="item">
            <div className="icon puzzle"/>
            {description}
        </div>,
        searchable: description,
        url: `/map/HINT-${id}`
    })

    const isItemEligible = (inputValue: string | null, item: Searchable) => {
        return inputValue !== null && 
            inputValue !== undefined &&
            inputValue.length > 0 &&
            itemDetails(item).searchable.toLowerCase().includes(inputValue.toLowerCase())
    }

    const itemsForInput = (inputValue: string | null, items: Searchable[]) => _.sortBy(
            items
            .filter(item => isItemEligible(inputValue, item)),
            item => itemDetails(item).searchable.length
        )
        .slice(0, 6)
    
    const onChange = (item: Searchable | null) => {
        if(item) {
            navigate(itemDetails(item).url)
            closeModal()
        }
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const openModal = () => {
        setShowModal(true)
    }

    return <>
        { showModal && <div className="search-overlay">
            <div className="search-modal">
                <Downshift
                    itemToString={item => (item ? itemDetails(item).id : '')}
                    onChange={onChange}
                    >
                    {
                        ({
                            getInputProps,
                            getItemProps,
                            getLabelProps,
                            getMenuProps,
                            isOpen,
                            inputValue,
                            highlightedIndex,
                            selectedItem,
                            getRootProps,
                        }) => 
                            <div>
                                <div
                                    style={{display: 'inline-block'}}
                                    {...getRootProps({}, {suppressRefError: true})}
                                >
                                    <input {...getInputProps()} autoFocus/>
                                </div>
                                <ul {...getMenuProps()}>
                                {isOpen
                                    ? itemsForInput(inputValue, items)
                                        .map((item, index) => (
                                        <li
                                            {...getItemProps({
                                            key: itemDetails(item).id,
                                            index,
                                            item,
                                            style: {
                                                backgroundColor:
                                                highlightedIndex === index ? 'lightgray' : 'white',
                                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                                            },
                                            })}
                                        >
                                            {itemDetails(item).render}
                                        </li>
                                        ))
                                    : null}
                                </ul>
                        </div>
                    }
                </Downshift>
            </div>
        </div> }
    </>
}

export default SearchOverlay