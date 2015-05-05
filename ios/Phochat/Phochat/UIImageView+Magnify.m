#import "UIImageView+Magnify.h"
#import <JTSImageViewController.h>

@implementation UIImageView (Magnify)

-(void)showAsFullScreenInViewController:(UIViewController*)vc
{
    JTSImageInfo *imageInfo = [[JTSImageInfo alloc] init];
    imageInfo.image = self.image;
    imageInfo.referenceRect = self.frame;
    imageInfo.referenceView = self.superview;
    
    // Setup view controller
    JTSImageViewController *imageViewer = [[JTSImageViewController alloc]
                                           initWithImageInfo:imageInfo
                                           mode:JTSImageViewControllerMode_Image
                                           backgroundStyle:JTSImageViewControllerBackgroundOption_Blurred];
    
    // Present the view controller.
    [imageViewer showFromViewController:vc transition:JTSImageViewControllerTransition_FromOriginalPosition];
}

@end
