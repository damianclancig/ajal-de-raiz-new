/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
