import {forwardRef, useRef} from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'

/*
const FancyButton = forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));
*/

// You can now get a ref directly to the DOM button:
//const ref = useRef(0);
//<FancyButton ref={ref}>Click me!</FancyButton>;

const MyLink = forwardRef((props, ref) => {
  let { href, children, ...rest } = props
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  )
})

export function Dropdown2() {
  return (
    <Menu>
      <Menu.Button>More</Menu.Button>
      <Menu.Items>
        <Menu.Item>
          <MyLink href="/profile">Profile</MyLink>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}