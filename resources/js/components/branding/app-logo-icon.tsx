import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
         <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className={props.className}
        >
            <image
                href="/pagpug_logo.png"  // ← Path relatif ke public/
                x="0"
                y="0"
                width="500"
                height="500"
                preserveAspectRatio="xMidYMid meet"
            />
        </svg>
    );
}
