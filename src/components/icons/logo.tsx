import Image from 'next/image';

const Logo = ({ size = 48 }: { size?: number }) => {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
        <Image
          src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1754490326/ajal-de-raiz/logo-min_ycwot1.png"
          alt="Ajal de Raiz Logo"
          fill
          sizes={`${size}px`}
          style={{ objectFit: 'contain' }}
        />
    </div>
  );
};

export default Logo;
