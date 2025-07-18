import Image from 'next/image';

const Logo = ({ size = 48 }: { size?: number }) => {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
        <Image
          src="/images/logo.png"
          alt="Ajal de Raiz Logo"
          fill
          sizes={`${size}px`}
          style={{ objectFit: 'contain' }}
        />
    </div>
  );
};

export default Logo;
