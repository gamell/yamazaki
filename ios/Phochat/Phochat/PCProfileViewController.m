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
#import <MBProgressHUD/MBProgressHUD.h>

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

- (void)viewWillAppear:(BOOL)animated
{
    PFUser *user = [PFUser currentUser];
    if (!user)
    {
        [self doUserLogin];
    }
    else
    {
        NSString *nameOfPerson = user[@"name"];
        if (!nameOfPerson)
        {
            [self performSegueWithIdentifier:@"askForNameSegue" sender:self];
        }
    }
    
    [super viewWillAppear:animated];
}

- (void)doUserLogin
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
    
    [self dismissViewControllerAnimated:YES completion:^{
        [weakSelf resolveEventAndNavigateForId:result];
    }];
}

- (void)resolveEventAndNavigateForId:(NSString *)eventId
{
    if (eventId)
    {
        PFQuery *query = [PFQuery queryWithClassName:@"Event"];
        [query whereKey:@"eventIdentifier" equalTo:eventId];
        __weak PCProfileViewController *weakSelf = self;
        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
        [query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
            [MBProgressHUD hideHUDForView:weakSelf.view animated:YES];
            if (!error && objects.count > 0)
            {
                weakSelf.scanned = eventId;
                [weakSelf performSegueWithIdentifier:showPhotosSegue sender:weakSelf];
            }
            else
            {
                NSLog(@"Error in loading photos: %@ %@", error, [error userInfo]);
                [weakSelf showError];
            }
        }];
    }
}

- (void)readerDidCancel:(QRCodeReaderViewController *)reader
{
    [self dismissViewControllerAnimated:YES completion:NULL];
}

- (void)showError
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Event Not Found"
                                                    message:@"Please scan correct QR Code for event"
                                                   delegate:nil
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil];
    [alert show];
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
