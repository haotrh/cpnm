import { useEffect, useRef, useState } from 'react'
import { AiOutlineAppstore, AiOutlineHeart, AiOutlineSearch, AiOutlineShopping, AiOutlineUser } from 'react-icons/ai'
import BetterReactModal from '../common/BetterReactModal'
import Link from 'next/link'
import AuthForm from '../AuthForm/AuthForm'
import { UnmountClosed } from 'react-collapse'
import classNames from 'classnames'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import CheckoutDrawer from '../Checkout/CheckoutDrawer'
import WishlistDrawer from '../Wishlist/WishlistDrawer'
import { Transition } from 'react-transition-group'
import { useAuth } from '../../lib/auth'
import CategoryDropdown from './CategoryDropdown'
import UserMenu from './UserMenu'
import { useCart } from '../../contexts/cart'
import useGlobal from '../../lib/query/useGlobal'
import _ from 'lodash'
import { UserRole } from '../../constants/user'

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

export default function Header() {
    const { data } = useGlobal()
    const info = data.storeInfo

    const [login, setLogin] = useState(false)
    const [showCategory, setShowCategory] = useState(false)
    const [showCheckout, setShowCheckout] = useState(false)
    const [showWishlist, setShowWishList] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const { authUser, loading } = useAuth()
    const { items, isLoading } = useCart()

    const categoriesRef = useRef(null)
    const userMenuRef = useRef(null)

    const handleClickOutsideCategory = () => {
        if (showCategory)
            setShowCategory(false)
    }

    const handleClickOutsideUserMenu = () => {
        if (showUserMenu)
            setShowUserMenu(false)
    }

    useOnClickOutside(categoriesRef, handleClickOutsideCategory)
    useOnClickOutside(userMenuRef, handleClickOutsideUserMenu)

    const handleOpenLogin = e => {
        e.preventDefault()
        if (!authUser)
            setLogin(true)
        else
            setShowUserMenu(!showUserMenu)
    }

    const handleCloseLogin = () => {
        if (!loading)
            setLogin(false)
    }

    useEffect(() => {
        if (authUser && showCategory)
            setShowCategory(false)
        if (!authUser && showUserMenu)
            setShowUserMenu(false)
    }, [authUser])

    return (
        <>
            <Transition in={showCategory} timeout={100} unmountOnExit>
                {state => (
                    <div style={{
                        ...transitionStyles[state]
                    }}
                        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-20 transition-opacity duration-100"
                    >
                    </div>
                )}
            </Transition>
            <header className="border-b flex py-2 px-24 sticky top-0 z-40 bg-white">
                <CheckoutDrawer isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
                <WishlistDrawer isOpen={showWishlist} onClose={() => setShowWishList(false)} />
                <div className="flex-1 flex items-center">
                    <Link href="/">
                        <a className="mr-4">
                            {info.name}
                        </a>
                    </Link>
                    <div ref={categoriesRef}>
                        <button onClick={() => setShowCategory(!showCategory)} className={classNames('px-1', {
                            'text-blue-700': showCategory
                        })}>
                            <AiOutlineAppstore className="inline-block mr-3" size={22} />
                            <span className="align-middle text-sm font-semibold">Danh mục sản phẩm</span>
                        </button>
                        <div className={classNames('absolute bg-white top-full w-60 translate-y-px transform', {
                            'invisible transition-all duration-100': !showCategory
                        })}>
                            <UnmountClosed isOpened={showCategory}>
                                <CategoryDropdown closeHandler={() => setShowCategory(false)} />
                            </UnmountClosed>
                        </div>
                    </div>
                </div>
                <form action='/search' className="flex-1 flex focus-within:shadow-md transition-shadow">
                    <input name="key"
                        className="flex-1 p-2 text-sm bg-gray-100 bg-opacity-75"
                        placeholder="Tìm kiếm sản phẩm..." />
                    <button className="flex-shrink-0 p-2 flex items-center justify-center bg-dark text-white">
                        <AiOutlineSearch size={22} />
                    </button>
                </form>
                <div className="flex-1 flex items-center justify-end text-2xl">
                    <Link href="/kiem-tra-don-hang">
                        <a className="inline-block mr-5 text-sm font-medium">
                            Kiểm tra đơn hàng
                        </a>
                    </Link>
                    <button onClick={() => setShowCheckout(true)} className="mr-5 flex relative">
                        <AiOutlineShopping />
                        {!_.isEmpty(items) &&
                            <span className="text-xs font-bold absolute bg-black text-white leading-3 rounded-full p-px w-4 h-4 flex-center -bottom-1 -right-1 block">
                                {items.reduce((acc, cur) => {
                                    return acc + cur.quantity
                                }, 0)}
                            </span>
                        }
                    </button>
                    {authUser && (
                        <button onClick={() => setShowWishList(true)} className="mr-5 flex">
                            <AiOutlineHeart />
                        </button>
                    )}
                    <div ref={userMenuRef} className="flex">
                        <button className="relative" onClick={handleOpenLogin}>
                            <AiOutlineUser />
                            {authUser && authUser.role !== UserRole.USER &&
                                <span className="absolute text-[10px] top-1/2 -translate-y-1/2 left-full origin-center p-1 leading-3 bg-black text-white">
                                    {_.findKey(UserRole, v => v === authUser.role)}
                                </span>
                            }
                        </button>
                        <div className="absolute top-full right-16">
                            <UnmountClosed isOpened={showUserMenu && authUser}>
                                <UserMenu />
                            </UnmountClosed>
                        </div>
                    </div>
                </div>
                <BetterReactModal
                    isOpen={(login && !authUser) || loading}
                    onClose={handleCloseLogin}
                    preventClose={loading}
                >
                    <AuthForm modalClose={handleCloseLogin} />
                </BetterReactModal>
            </header>
        </>
    )
}