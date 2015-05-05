//
//  PCProfileViewController.m
//  Phochat
//
//  Created by Daniel Koh on 4/23/15.
//  Copyright (c) 2015 Carunaga. All rights reserved.
//

#import "PCProfileViewController.h"
#import <BFPaperButton.h>
#import <Parse/Parse.h>
#import <ParseUI/ParseUI.h>
#import <QRCodeReaderViewController.h>
#import "PCPhotosCollectionViewController.h"

#define showPhotosSegue @"showPhotosSegue"

@interface PCProfileViewController () <PFLogInViewControllerDelegate, PFSignUpViewControllerDelegate, QRCodeReaderDelegate>
@property (weak, nonatomic) IBOutlet BFPaperButton *loginButton;
@property (weak, nonatomic) IBOutlet BFPaperButton *photosButton;
@property NSString *scanned;
@end

@implementation PCProfileViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)didTapLoginButton:(id)sender
{
    PFLogInViewController *logInViewController = [[PFLogInViewController alloc] init];
    logInViewController.delegate = self;
    logInViewController.signUpController.emailAsUsername = YES;
    logInViewController.signUpController.delegate = self;
    [self presentViewController:logInViewController animated:YES completion:nil];
}

- (IBAction)didTapPhotosButton:(id)sender
{
    [self performSegueWithIdentifier:showPhotosSegue sender:self];
}

- (IBAction)didTapQRCodeButton:(id)sender {
    NSArray *types = @[AVMetadataObjectTypeQRCode];
    QRCodeReaderViewController *reader = [QRCodeReaderViewController readerWithMetadataObjectTypes:types];
    reader.modalPresentationStyle = UIModalPresentationFormSheet;
    reader.delegate = self;
    [self presentViewController:reader animated:YES completion:NULL];
}

- (void)logInViewController:(PFLogInViewController *)logInController didLogInUser:(PFUser *)user
{
    [user saveInBackground];
    [logInController dismissViewControllerAnimated:YES completion:nil];
}

- (void)signUpViewController:(PFSignUpViewController *)signUpController didSignUpUser:(PFUser *)user
{
    [signUpController dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - QRCodeReader Delegate Methods

- (void)reader:(QRCodeReaderViewController *)reader didScanResult:(NSString *)result
{
    __weak PCProfileViewController *weakSelf = self;
    NSLog(@"Scanned result - %@", result);
    self.scanned = result;
    [self dismissViewControllerAnimated:YES completion:^{
        [weakSelf performSegueWithIdentifier:showPhotosSegue sender:weakSelf];
    }];
}

- (void)readerDidCancel:(QRCodeReaderViewController *)reader
{
    [self dismissViewControllerAnimated:YES completion:NULL];
}


#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:showPhotosSegue])
    {
        PCPhotosCollectionViewController *vc = segue.destinationViewController;
        vc.eventId = self.scanned;
    }
}


@end
