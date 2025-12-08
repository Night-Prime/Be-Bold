import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation items for mapping
    const navItems = [
        { name: "Shop", href: "#shop" },
        { name: "Our Story", href: "#about" },
        { name: "Beauty Tips", href: "#blog" },
    ];

    // Animation variants for staggered reveal
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: .5,
                delayChildren: .1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const mobileMenuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 1,
                ease: "easeInOut",
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const mobileItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed w-full z-50 transition-all duration-300 rounded-b-sm shadow-lg border-b-2 border-purple800 bg-purple800 ${scrolled ? 'shadow-md py-4' : 'py-6'
                }`}
        >
            <div className="max-w-8xl mx-auto px-6 flex items-center justify-between text-purple100">

                {/* Desktop Navigation with staggered reveal */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="hidden md:flex items-center font-bold space-x-8"
                >
                    {navItems.map((item, index) => (
                        <motion.a
                            key={index}
                            variants={itemVariants}
                            href={item.href}
                            className="text-white hover:text-purple100 transition-colors duration-300 relative group"
                            whileHover={{ y: -2 }}
                        >
                            {item.name}
                            <motion.span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple100 group-hover:w-full transition-all duration-300"
                            />
                        </motion.a>
                    ))}
                </motion.div>


                {/* Logo with animation */}
                <motion.div
                    variants={logoVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-2xl font-bold tracking-wider flex flex-row gap-2 items-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <span>BE</span>
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                    >
                        <Star className="w-4 h-4 fill-current" />
                    </motion.div>
                    <span>BOLD</span>
                </motion.div>



                {/* Right side buttons */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex items-center space-x-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-white hover:text-purple100 transition relative"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-purple200 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                </motion.div>
            </div>

            {/* Mobile Menu with animations */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="md:hidden bg-white/95 backdrop-blur-sm border-rounded mt-4 shadow-lg overflow-hidden"
                    >
                        <div className="px-6 py-4 space-y-4">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={index}
                                    variants={mobileItemVariants}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-purple800 hover:text-purple500 font-semibold transition-colors duration-300"
                                    whileHover={{ x: 10 }}
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}