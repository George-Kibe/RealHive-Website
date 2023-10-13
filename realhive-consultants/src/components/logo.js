'use client'

import { jsx, Image } from 'theme-ui';
import logo from 'public/logo.png';
import { Link } from '@/components/link';

export default function Logo() {
  return (
    <Link
      path="/"
      sx={{
        variant: 'links.logo',
      }}
    >
      <Image src={logo} sx={{ display: 'flex' }} alt="startup landing logo" />
    </Link>
  );
}