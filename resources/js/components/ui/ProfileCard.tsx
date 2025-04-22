import React from 'react';
import { Link } from '@inertiajs/react';

type ProfileCardProps = {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
    buttonVariant: 'primary' | 'secondary';
    children: React.ReactNode; // For the image/icon area
    containerClassName?: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
    title,
    description,
    buttonText,
    buttonHref,
    buttonVariant,
    children,
    containerClassName = '',
}) => {
    const primaryButtonClasses = "btn-primary group focus:ring-opacity-50 inline-block w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-300/50 focus:ring-2 focus:ring-blue-400 focus:outline-none sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 dark:hover:shadow-blue-900/50";
    const secondaryButtonClasses = "btn-secondary group focus:ring-opacity-50 inline-block w-full rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:px-4 sm:py-2 lg:px-5 lg:py-2.5";

    const buttonClasses = buttonVariant === 'primary' ? primaryButtonClasses : secondaryButtonClasses;

    // Icons for buttons (could be made dynamic if needed)
    const primaryIcon = (
        <svg className="mr-1.5 h-4 w-4 transition-transform group-hover:scale-110 sm:h-4 sm:w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
        </svg>
    );
    const secondaryIcon = (
        <svg className="mr-1.5 h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    );

    const buttonIcon = buttonVariant === 'primary' ? primaryIcon : secondaryIcon;
    const buttonAriaLabel = `Ir para ${title}`; // Or pass explicitly if needed

    return (
        <div className={`card-profile overflow-hidden overmodule-hidden flex w-full max-w-md flex-col rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 ${containerClassName}`}>
            <div className="relative">
                {children} {/* Render the image/icon area passed as children */}
            </div>

            <div className="flex flex-1 flex-col p-3 text-center sm:p-4 lg:p-6">
                <h2 className={`font-fredoka mb-1.5 text-lg font-bold sm:mb-2 sm:text-xl lg:mb-3 lg:text-2xl ${buttonVariant === 'primary' ? 'text-blue-600 dark:text-blue-400' : 'text-blue-800 dark:text-blue-400'}`}>
                    {title}
                </h2>
                <p className="font-nunito mb-3 flex-1 text-sm text-gray-600 sm:mb-4 sm:text-base lg:mb-5 dark:text-gray-300">
                    {description}
                </p>
                <Link
                    href={buttonHref}
                    className={buttonClasses}
                    aria-label={buttonAriaLabel}
                >
                    <span className="flex items-center justify-center transition-transform group-hover:translate-x-1">
                        {buttonIcon}
                        {buttonText}
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default ProfileCard; 