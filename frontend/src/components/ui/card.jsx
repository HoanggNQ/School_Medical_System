import React from 'react';

// Utility function to merge classes (replacing cn)
const cn = (...classes) => classes.filter(Boolean).join(' ');

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group relative rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/50 overflow-hidden',
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex flex-col space-y-2 p-6 pb-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100/50',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-gray-600 leading-relaxed font-medium',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      'relative p-6 pt-4 text-gray-700 leading-relaxed',
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between p-6 pt-0 bg-gradient-to-r from-gray-50/50 to-gray-100/50 border-t border-gray-100/50',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Modern Button Component matching the design
const ModernButton = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    secondary: "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700",
    warning: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
  };
  
  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Demo component to showcase the enhanced cards
const CardDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Enhanced Card Components
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Modern Design</CardTitle>
              <CardDescription>
                Experience the future of UI components with our enhanced cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                These cards feature beautiful gradients, smooth animations, and modern styling that will make your application stand out.
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Modern</span>
                <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Responsive</span>
              </div>
            </CardContent>
            <CardFooter>
              <ModernButton variant="primary">
                Đăng nhập
              </ModernButton>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card>
            <CardHeader>
              <CardTitle>✨ Smooth Animations</CardTitle>
              <CardDescription>
                Hover effects and transitions that delight users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Every interaction is carefully crafted with smooth transitions and hover effects that provide excellent user feedback.
              </p>
              <div className="space-y-2">
                <div className="h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-3/4 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500">Animation Quality: 75%</p>
              </div>
            </CardContent>
            <CardFooter>
              <ModernButton variant="success">
                Thử ngay
              </ModernButton>
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card>
            <CardHeader>
              <CardTitle>🎨 Beautiful Gradients</CardTitle>
              <CardDescription>
                Stunning color combinations and visual hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our cards use carefully selected gradients and color schemes that create visual depth and maintain excellent readability.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded"></div>
                <div className="h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded"></div>
                <div className="h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded"></div>
              </div>
            </CardContent>
            <CardFooter>
              <ModernButton variant="secondary">
                Khám phá
              </ModernButton>
            </CardFooter>
          </Card>

          {/* Card 4 - Spanning two columns */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>🌟 Feature Highlights</CardTitle>
              <CardDescription>
                Everything you need to create amazing user interfaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Responsive Design</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Smooth Animations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Modern Styling</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">Customizable</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="text-sm font-medium">Accessible</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Performance Optimized</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <ModernButton variant="primary">
                Bắt đầu ngay
              </ModernButton>
              <ModernButton variant="outline">
                Tài liệu
              </ModernButton>
            </CardFooter>
          </Card>

          {/* Card 5 */}
          <Card>
            <CardHeader>
              <CardTitle>📱 Responsive</CardTitle>
              <CardDescription>
                Works perfectly on all devices and screen sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Built with mobile-first approach, ensuring your cards look great on phones, tablets, and desktops.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>📱 Mobile</span>
                <span>💻 Desktop</span>
                <span>📺 Large Screens</span>
              </div>
            </CardContent>
            <CardFooter>
              <ModernButton variant="warning">
                Kiểm tra
              </ModernButton>
            </CardFooter>
          </Card>

          {/* Card 6 - New card with more button variants */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>🎯 Button Variants</CardTitle>
              <CardDescription>
                Showcase of all available button styles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                <ModernButton variant="primary">Đăng nhập</ModernButton>
                <ModernButton variant="secondary">Đăng ký</ModernButton>
                <ModernButton variant="success">Thành công</ModernButton>
                <ModernButton variant="warning">Cảnh báo</ModernButton>
                <ModernButton variant="danger">Xóa</ModernButton>
                <ModernButton variant="outline">Hủy bỏ</ModernButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export default CardDemo;