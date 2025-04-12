const Footer = () => {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Foodie. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
          <a href="/restaurant/login" className="hover:text-primary">Restaurant Login</a> {/* Added Restaurant Login Link */}
          <a href="/delivery/login" className="hover:text-primary">Delivery Boy Login</a> {/* Added Delivery Boy Login Link */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
